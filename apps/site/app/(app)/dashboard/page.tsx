import { type Metadata } from "next"
import { db } from "@/db"
import { strategies } from "@/db/schema"
import { env } from "@/env.mjs"

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
import TokenPriceChart from "@/components/charts/token-price-chart"
import DashboardOverview from "@/components/dashboard-overview"
import { Icons } from "@/components/icons"

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
    })
    .from(strategies)

  return (
    <>
      <section id="overview" aria-label="overview-heading">
        <DashboardOverview />
        {/* <TokenPriceChart /> */}
        <div className="my-2 md:my-4">
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
      </section>
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
                {/* <CardContent className="flex flex-col">
                  {`$${strategy.assets}`}
                </CardContent> */}
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
