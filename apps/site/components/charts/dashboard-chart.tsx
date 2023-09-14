"use client"

import { format } from "date-fns"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

interface DashboardChartProps {
  data: [][]
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const formattedData = data.map((x) => ({
    time: x[0],
    value: x[1],
  }))

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={formattedData}>
        <CartesianGrid />
        <XAxis
          dataKey="time"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickCount={3}
          interval={"equidistantPreserveStart"}
          tickFormatter={(value) => format(new Date(value), "PP")}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Line type="monotone" dataKey="value" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
