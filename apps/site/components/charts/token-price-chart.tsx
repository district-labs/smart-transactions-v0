"use client"

import { useState } from "react"
import { type DefiLlamaToken } from "@/types"
import { useQuery } from "@tanstack/react-query"
import {
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn, formatDate } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import ChartLoadingSkeleton from "./chart-loading-skeleton"
import {
  ChartTimeFilters,
  type ChartTimeFiltersOptions,
} from "./chart-time-filters"

interface TokenPriceChartProps {
  outToken: DefiLlamaToken | undefined
  inToken: DefiLlamaToken | undefined
}

export default function TokenPriceChart({
  outToken,
  inToken,
}: TokenPriceChartProps) {
  const [chartRange, setChartRange] =
    useState<ChartTimeFiltersOptions["range"]>("30d")

  const { data, status, refetch } = useQuery(
    ["tokenChart", outToken?.symbol, inToken?.symbol, chartRange],
    {
      queryFn: () => {
        if (!inToken || !outToken) return

        return fetch("/api/token/chart-data", {
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
            range: chartRange,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())
      },
      enabled: !!inToken && !!outToken,
    }
  )

  if (status === "error") return <p>Failed to load chart</p>

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-30 rounded border bg-background px-3 py-2 text-center">
          <p className="font-medium">{payload[0].payload.price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(payload[0].payload.time, {
              year: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {`${new Date(payload[0].payload.time * 1000).getHours()}:00`}
          </p>
        </div>
      )
    }
  }

  let percentage

  if (status === "success") {
    percentage = (
      ((data.slice(-1)[0].price - data.slice(0)[0].price) /
        data.slice(0)[0].price) *
      100
    ).toFixed(2)

    if (parseFloat(percentage) > 0) {
      percentage = "+" + percentage
    }
  }

  return (
    <Card>
      <CardHeader>
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
            <CardTitle className="text-2xl font-semibold tracking-tight">{`${inToken?.symbol}/${outToken?.symbol}`}</CardTitle>
          </div>
          <ChartTimeFilters
            range={chartRange}
            setRange={setChartRange}
            refetch={refetch}
          />
        </div>
        <CardDescription>
          {status === "success" && (
            <>
              <h2 className="text-xl font-medium text-foreground">
                {data.slice(-1)[0].price.toFixed(2)}
              </h2>
              <p
                className={cn(
                  "text-muted-foreground",
                  parseFloat(percentage) > 0 && "text-green-600",
                  parseFloat(percentage) < 0 && "text-destructive"
                )}
              >
                {percentage}%
              </p>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <ChartLoadingSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={300} minHeight={250}>
            <LineChart width={500} height={300} data={data}>
              <Line
                type="monotone"
                dataKey="price"
                dot={false}
                stroke="green"
              />
              <XAxis
                dataKey="time"
                tickMargin={5}
                tickLine={false}
                domain={["auto", "auto"]}
                interval="preserveStartEnd"
                tickFormatter={formatDate}
                minTickGap={24}
              />
              <YAxis domain={["auto", "auto"]} orientation="right" hide />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
