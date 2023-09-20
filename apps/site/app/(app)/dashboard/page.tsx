import React from "react"
import { type Metadata } from "next"
import { cookies } from "next/headers"
import { db } from "@/db"
import { strategies } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"

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
import DashboardOverview from "@/components/charts/dashboard-overview"
import { Icons } from "@/components/icons"
import { GenerateButton } from "@/components/strategies/generate-button"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Dashboard",
  description: "Manager your investments",
}

export default async function DashboardPage() {
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
      <DashboardOverview />
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
            <GenerateButton />
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
