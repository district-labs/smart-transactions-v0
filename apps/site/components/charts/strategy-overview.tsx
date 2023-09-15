"use client"

import { useEffect, useState } from "react"

import { getCoinMarketChart } from "@/app/_actions/gecko"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import {
  ChartTimeFilters,
  type ChartTimeFiltersOptions,
} from "./chart-time-filters"
import DashboardChart from "./dashboard-chart"

interface StrategyOverviewProps {}

export default function StrategyOverview() {
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
    <div className="col-span-3 space-y-4 lg:col-span-2">
      <div className="flex flex-col justify-between md:flex-row md:items-end">
        <dl className="flex max-w-2xl gap-x-8 divide-x lg:mx-0 lg:max-w-none">
          <div className="flex flex-col gap-y-2">
            <dt className="text-sm leading-6">Net Assets</dt>
            <dd className="text-3xl font-semibold tracking-tight">$24,7M</dd>
          </div>
          <div className="flex flex-col gap-y-2 pl-6">
            <dt className="text-sm leading-6">Return (chart value)</dt>
            <dd className="text-3xl font-semibold tracking-tight">
              $12,345.00
            </dd>
            <span>27.2%</span>
          </div>
        </dl>
        <ChartTimeFilters range={chartRange} setRange={setChartRange} />
      </div>
      {chartData && <DashboardChart data={chartData} />}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" className="h-7 bg-blue-500 px-10">
          ETH
        </Button>
        <Button size="sm" className="h-7 bg-orange-500 px-10">
          BTC
        </Button>
        <Button size="sm" className="h-7 bg-yellow-500 px-10">
          S&P
        </Button>
        <Button size="sm" className="h-7 bg-zinc-500 px-5">
          <Icons.plus className="mr-2 h-4 w-4" />
          Add benchmark
        </Button>
      </div>
    </div>
  )
}
