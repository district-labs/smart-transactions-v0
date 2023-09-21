"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { LineChart } from "@tremor/react"

import { formatPrice } from "@/lib/utils"

import ChartLoadingSkeleton from "./chart-loading-skeleton"
import {
  ChartTimeFilters,
  type ChartTimeFiltersOptions,
} from "./chart-time-filters"

export default function TokenPriceChart() {
  const [chartRange, setChartRange] =
    useState<ChartTimeFiltersOptions["range"]>("30d")

  const { data, status, refetch } = useQuery(["tokenChart", chartRange], {
    queryFn: () =>
      fetch("/api/token/chart-data", {
        method: "POST",
        body: JSON.stringify({
          coins: { chainId: 1, type: "native" },
          period: chartRange,
          spanDataPoints: 50,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  })

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
          index="timestamp"
          categories={["price"]}
          yAxisWidth={64}
          autoMinValue={true}
          valueFormatter={(value) =>
            formatPrice(value, { notation: "standard" })
          }
        />
      )}
    </div>
  )
}
