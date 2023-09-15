"use client"

import { LineChart } from "@tremor/react"
import { format } from "date-fns"

import { formatDate, formatPrice } from "@/lib/utils"

interface DashboardChartProps {
  data: [number, number][]
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const formattedData = data.map((obj) => {
    const formattedTime = formatDate(obj[0])

    return {
      time: formattedTime,
      strategy: obj[1],
    }
  })

  return (
    <LineChart
      data={formattedData}
      index="time"
      categories={["strategy"]}
      valueFormatter={(value) => formatPrice(value, { notation: "standard" })}
      yAxisWidth={64}
      autoMinValue={true}
    />
  )
}
