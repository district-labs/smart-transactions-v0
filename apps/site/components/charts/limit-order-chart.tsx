"use client"

import { useEffect, useState } from "react"
import { LineChart } from "@tremor/react"

import { calculatePeriod, formatDate, formatPrice } from "@/lib/utils"
import { useChart } from "@/hooks/use-chart"

import {
  ChartTimeFilters,
  type ChartTimeFiltersOptions,
} from "./chart-time-filters"

export default function LimitOrderChart() {
  const [chartRange, setChartRange] =
    useState<ChartTimeFiltersOptions["range"]>("30d")
  const [chartData, setChartData] = useState<
    {
      timestamp: string
      price: number
    }[]
  >([])

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

    const formattedData = data?.coins["coingecko:ethereum"].prices.map(
      (obj) => {
        const formattedTime = formatDate(obj.timestamp)

        return {
          timestamp: formattedTime,
          price: obj.price,
        }
      }
    )
    setChartData(formattedData || [])
  }, [data, chartRange])

  return (
    <div>
      <ChartTimeFilters
        range={chartRange}
        setRange={setChartRange}
        refetch={refetch}
      />
      {data && (
        <LineChart
          data={chartData}
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
