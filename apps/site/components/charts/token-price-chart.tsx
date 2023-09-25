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
                chainId: outToken.chainId,
                type: "erc20",
                address: outToken.address,
              },
              {
                chainId: inToken.chainId,
                type: "erc20",
                address: inToken.address,
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
    <div>
      <ChartTimeFilters
        range={chartRange}
        setRange={setChartRange}
        refetch={refetch}
      />
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
    </div>
  )
}
