"use client"

import { useEffect, useState } from "react"
import { LineChart } from "@tremor/react"

import { calculatePeriod } from "@/lib/utils"
import { useChart } from "@/hooks/use-chart"

import {
  ChartTimeFilters,
  type ChartTimeFiltersOptions,
} from "./chart-time-filters"

export default function LimitOrderChart() {
  const [chartRange, setChartRange] =
    useState<ChartTimeFiltersOptions["range"]>("30d")

  const { data, refetch } = useChart({
    coins: {
      chainId: 1,
      type: "native",
    },
    timestamp: {
      type: "end",
      value: Math.floor(Date.now() / 1000),
    },
    period: calculatePeriod(chartRange, 50),
    spanDataPoints: 50,
    enabled: false,
  })
  useEffect(() => {
    refetch()
  }, [])

  return (
    <div>
      <ChartTimeFilters
        range={chartRange}
        setRange={setChartRange}
        refetch={refetch}
      />
      {data && (
        <LineChart
          data={data.coins["coingecko:ethereum"].prices}
          index="timestamp"
          categories={["price"]}
          autoMinValue={true}
        />
      )}
    </div>
  )
}
