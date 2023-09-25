"use client"

import { useState } from "react"
import { DefiLlamaToken } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { LineChart } from "@tremor/react"

import ChartLoadingSkeleton from "./chart-loading-skeleton"
import {
  ChartTimeFilters,
  type ChartTimeFiltersOptions,
} from "./chart-time-filters"

interface TokenPriceChartProps {
  outToken: DefiLlamaToken
  inToken: DefiLlamaToken
}

export default function TokenPriceChart({
  outToken,
  inToken,
}: TokenPriceChartProps) {
  const [chartRange, setChartRange] =
    useState<ChartTimeFiltersOptions["range"]>("30d")

  const { data, status, refetch } = useQuery(
    ["tokenChart", `${outToken.symbol}-${inToken.symbol}`, chartRange],
    {
      queryFn: () =>
        fetch("/api/token/chart-data", {
          method: "POST",
          body: JSON.stringify({
            coins: [
              {
                chainId: inToken.chainId,
                type: "erc20",
                address: inToken.address,
              },
              {
                chainId: outToken.chainId,
                type: "erc20",
                address: outToken.address,
              },
            ],
            period: chartRange,
            spanDataPoints: 50,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()),
    }
  )

  if (status === "error") return <p>Failed to load chart</p>

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2">
          {outToken && inToken && (
            <div className="flex -space-x-1">
              <img
                src={outToken?.logoURI}
                alt={outToken.name}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-background"
              />
              <img
                src={inToken?.logoURI}
                alt={inToken.name}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-background"
              />
            </div>
          )}
          <h2 className="text-2xl font-medium tracking-tight">
            {`${inToken.symbol}/${outToken.symbol}`}
          </h2>
        </div>
        <ChartTimeFilters
          range={chartRange}
          setRange={setChartRange}
          refetch={refetch}
        />
      </div>
      {status === "loading" ? (
        <ChartLoadingSkeleton />
      ) : (
        <LineChart
          data={data}
          index="time"
          categories={["price"]}
          yAxisWidth={64}
          autoMinValue={true}
        />
      )}
    </>
  )
}
