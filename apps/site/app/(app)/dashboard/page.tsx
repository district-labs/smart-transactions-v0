import React from "react"
import { type Metadata } from "next"
import { cookies } from "next/headers"
import { db } from "@/db"
import { strategies } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"

import { getRequestCookie } from "@/lib/session"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardChart from "@/components/charts/dashboard-chart"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dashboard",
  description: "Manager your investments",
}

export default async function DashboardPage() {
  const user = await getRequestCookie(cookies())

  const allStrategies = await db
    .select({
      id: strategies.id,
      name: strategies.name,
      description: strategies.description,
      assets: strategies.assets,
    })
    .from(strategies)
    .where(eq(strategies.managerId, 2))

  return (
    <>
      <h2 className="text-2xl tracking-tight sm:text-3xl">Overview</h2>
      <div className="flex flex-col justify-between md:flex-row md:items-end">
        <dl className="mt-4 flex max-w-2xl gap-x-8 divide-x lg:mx-0 lg:max-w-none">
          <div className="flex flex-col gap-y-2">
            <dt className="text-sm leading-6">Current Balance</dt>
            <dd className="text-3xl font-semibold tracking-tight">$24,789</dd>
          </div>
          <div className="flex flex-col gap-y-2 pl-6">
            <dt className="text-sm leading-6">Return (chart value)</dt>
            <dd className="text-3xl font-semibold tracking-tight">
              $12,345.00
            </dd>
            <span>27.2%</span>
          </div>
        </dl>
        <div className="flex justify-end space-x-2 text-muted-foreground">
          <Button variant="ghost" size="icon">
            1M
          </Button>
          <Button variant="ghost" size="icon">
            1Y
          </Button>
        </div>
      </div>
      <div className="my-4 md:my-8">
        <DashboardChart />
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
      <section
        id="strategy"
        aria-label="strategy-heading"
        className="my-8 grid grid-cols-4 gap-8"
      >
        <div className="col-span-4 space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl tracking-tight sm:text-2xl">
              My Strategies
            </h3>
            <Button>
              <Icons.plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle>
                    {strategy.name} +{" "}
                    <span className="font-normal">{strategy.id}</span>
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {strategy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  {`$${strategy.assets}`}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="col-span-4 lg:col-span-1">
          <CardHeader>
            <CardTitle>Watchlists</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </section>
    </>
  )
}
