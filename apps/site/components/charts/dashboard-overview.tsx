"use client"

import { useEffect, useState } from "react"

import { getCoinMarketChart } from "@/app/_actions/gecko"

import { formatPrice } from "../base-currency/use-format-price"
import { Button } from "../ui/button"
import {
  ChartTimeFilters,
  type ChartTimeFiltersOptions,
} from "./chart-time-filters"
import DashboardChart from "./dashboard-chart"

// type DashboardOverviewProps = {}

export default function DashboardOverview() {
  const [chartData, setChartData] = useState<[number, number][] | null>(null)
  const [chartRange, setChartRange] =
    useState<ChartTimeFiltersOptions["range"]>("30")

  const fetchChartData = async () => {
    const res = await getCoinMarketChart({
      coinId: "ethereum",
      days: chartRange,
    })
    setChartData(res.prices)
  }

  useEffect(() => {
    fetchChartData()
  }, [chartRange])

  return (
    <>
      <h2 className="text-2xl tracking-tight sm:text-3xl">Overview</h2>
      <div className="flex flex-col justify-between md:flex-row md:items-end">
        <dl className="mt-4 flex max-w-2xl gap-x-8 divide-x lg:mx-0 lg:max-w-none">
          <div className="flex flex-col gap-y-2">
            <dt className="text-sm leading-6">Current Balance</dt>
            <dd className="text-3xl font-semibold tracking-tight">
              {formatPrice(24789)}
            </dd>
          </div>
          <div className="flex flex-col gap-y-2 pl-6">
            <dt className="text-sm leading-6">Return (chart value)</dt>
            <dd className="text-3xl font-semibold tracking-tight">
              {formatPrice(32)}
            </dd>
            <span>27.2%</span>
          </div>
        </dl>
        <ChartTimeFilters range={chartRange} setRange={setChartRange} />
      </div>
      <div className="my-4 md:my-8">
        {chartData && <DashboardChart data={chartData} />}
        <p className="text-muted-foreground">Compare with:</p>
        <div className="mt-2 flex space-x-2">
          <Button size="sm" className="h-7 bg-blue-500 px-10">
            ETH
          </Button>
          <Button size="sm" className="h-7 bg-orange-500 px-10">
            BTC
          </Button>
          <Button size="sm" className="h-7 bg-yellow-500 px-10">
            S&P
          </Button>
        </div>
      </div>
    </>
  )
}
