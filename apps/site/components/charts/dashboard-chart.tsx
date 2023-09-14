"use client"

import { LineChart } from "@tremor/react"
import { format } from "date-fns"

interface DashboardChartProps {
  data: [number, number][]
}

export const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
  }).format(number)}`

export default function DashboardChart({ data }: DashboardChartProps) {
  // const formattedData = data.map((x) => ({
  //   time: x[0],
  //   value: x[1],
  // }))

  const formattedData = data.map((obj) => {
    const formattedTime = format(new Date(obj[0]), "MMM-d")

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
      valueFormatter={valueFormatter}
      yAxisWidth={64}
      autoMinValue={true}
    />
  )
}
