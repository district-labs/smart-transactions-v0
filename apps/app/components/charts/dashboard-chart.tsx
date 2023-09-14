"use client"

import { faker } from "@faker-js/faker"
import { format } from "date-fns"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

function generateChartData(days: number = 30) {
  const chartData = []

  for (let i = 0; i < days; i++) {
    chartData.push({
      date: faker.date.between({
        from: "2020-01-01T00:00:00.000Z",
        to: "2030-01-01T00:00:00.000Z",
      }),
      value: faker.number.float({ min: 1000, max: 30000, precision: 0.01 }),
    })
  }

  return chartData
}

export default function DashboardChart() {
  const data = generateChartData(30)

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data}>
        <CartesianGrid />
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => format(value as Date, "MM-dd")}
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
