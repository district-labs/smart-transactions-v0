import { notFound } from "next/navigation"
import { db } from "@/db"
import { strategies, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { char } from "drizzle-orm/mysql-core"

import { toTitleCase } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from "@/components/breadcrumbs"
import DashboardChart from "@/components/charts/dashboard-chart"
import { Icons } from "@/components/icons"
import { getCoinMarketChart } from "@/app/_actions/gecko"
import { getTokenChartData } from "@/app/_actions/llama"

interface StrategyPageProps {
  params: {
    strategyId: string
  }
}

export default async function StrategyPage({ params }: StrategyPageProps) {
  const strategyId = Number(params.strategyId)

  const strategy = await db.query.strategies.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      assets: true,
      category: true,
      performanceFee: true,
      platformFee: true,
      managerId: true,
    },
    where: eq(strategies.id, strategyId),
  })

  if (!strategy) {
    notFound()
  }

  const manager = await db.query.users.findFirst({
    columns: {
      id: true,
      firstName: true,
      about: true,
    },
    where: eq(users.id, strategy.managerId),
  })

  // Add a field to strategy schema for token
  const chartData = await getCoinMarketChart({
    coinId: "ethereum",
    days: "7",
  })

  return (
    <>
      <Breadcrumbs
        segments={[
          { title: "Strategies", href: "/strategies" },
          { title: "", href: "/dashboard" },
        ]}
        className="mt-2"
      />
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <h2 className="text-2xl tracking-tight sm:text-3xl">{strategy.name}</h2>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button variant="secondary">Exit</Button>
          <Button>Invest</Button>
          <Button variant="ghost" size="icon">
            <Icons.verticalDots className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <section
        id="strategy"
        aria-label="strategy-heading"
        className="my-8 grid grid-cols-3 gap-8"
      >
        <div className="col-span-3 space-y-4 lg:col-span-2">
          <div className="flex flex-col justify-between md:flex-row md:items-end">
            <dl className="flex max-w-2xl gap-x-8 divide-x lg:mx-0 lg:max-w-none">
              <div className="flex flex-col gap-y-2">
                <dt className="text-sm leading-6">Net Assets</dt>
                <dd className="text-3xl font-semibold tracking-tight">
                  $24,7M
                </dd>
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
          <DashboardChart data={chartData.prices} />
          <div className="mt-2 flex items-center justify-center space-x-2">
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
        <Tabs defaultValue="invest" className="col-span-3 h-fit lg:col-span-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invest">Invest</TabsTrigger>
            <TabsTrigger value="exit">Exit</TabsTrigger>
          </TabsList>
          <TabsContent value="invest">
            <Card>
              <CardHeader>
                <CardTitle className="leading-normal">{`Invest in ${strategy.name} strategy`}</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deposit">Deposit Amount</Label>
                    <Input id="deposit" type="number" placeholder="1000 USDC" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deviation-level">Deviation Level</Label>
                    <Select defaultValue="3">
                      <SelectTrigger
                        id="deviation-level"
                        className="line-clamp-1 w-[160px] truncate"
                      >
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1%</SelectItem>
                        <SelectItem value="3">3%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">Invest</Button>
              </CardContent>
              <CardFooter className="flex w-full flex-col gap-y-2 border-t pt-2 text-sm">
                <div className="flex w-full items-center justify-between">
                  <p>Platform Fee: </p>
                  <p>{`${strategy.platformFee}%`}</p>
                </div>
                <div className="flex w-full items-center justify-between">
                  <p>Performance Fee: </p>
                  <p>{`${strategy.performanceFee}%`}</p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="exit">
            <Card>
              <CardHeader>
                <CardTitle className="leading-normal">{`Exit ${strategy.name} strategy`}</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deposit">Deposit Amount</Label>
                    <Input id="deposit" type="number" placeholder="1000 USDC" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deviation-level">Deviation Level</Label>
                    <Select defaultValue="3">
                      <SelectTrigger
                        id="deviation-level"
                        className="line-clamp-1 w-[160px] truncate"
                      >
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1%</SelectItem>
                        <SelectItem value="3">3%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="destructive" className="w-full">
                  Exit
                </Button>
              </CardContent>
              <CardFooter className="flex w-full flex-col gap-y-2 border-t pt-2 text-sm">
                <div className="flex w-full items-center justify-between">
                  <p>Platform Fee: </p>
                  <p>{`${strategy.platformFee}%`}</p>
                </div>
                <div className="flex w-full items-center justify-between">
                  <p>Performance Fee: </p>
                  <p>{`${strategy.performanceFee}%`}</p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      <section
        id="information"
        aria-label="information-heading"
        className="my-8 grid w-full grid-cols-2 gap-4"
      >
        <div className="col-span-2 space-y-2">
          <h3 className="text-xl tracking-tight sm:text-2xl">Information</h3>
          <Separator />
        </div>
        <div className="col-span-2 space-y-4 md:col-span-1">
          <div>
            <Label htmlFor="manager" className="text-muted-foreground">
              Strategy Manager
            </Label>
            <div className="mt-2 flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://pbs.twimg.com/profile_images/1666003748399841280/4vrLJPIO_400x400.png" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div>
                <p id="manager" className="text-sm font-medium leading-none">
                  {manager?.name || "Strategy Man"}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {manager?.about || "Bio on strategy"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-muted-foreground">
              About this Strategy
            </Label>
            <p id="description" className="text-sm">
              {strategy.description}
            </p>
          </div>
        </div>
        <div className="col-span-2 space-y-2 md:col-span-1">
          <Label htmlFor="facts" className="text-muted-foreground">
            Key Facts
          </Label>
          <Table id="facts">
            <TableBody>
              <TableRow>
                <TableCell>Size of Fund (millions)</TableCell>
                <TableCell className="text-right">{strategy.assets}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell className="text-right">
                  {strategy.category}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fee Structure</TableCell>
                <TableCell className="text-right">
                  <span>Platform Fee - {strategy.platformFee}%</span>
                  <br />
                  <span>Performance Fee - {strategy.performanceFee}%</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="col-span-2">
          <Label htmlFor="breakdown" className="text-muted-foreground">
            Strategy Breakdown
          </Label>
          <div className="ml-8 mt-4 space-y-2">
            <Skeleton className="h-8 w-full max-w-2xl" />
            <Skeleton className="ml-10 h-8 w-full max-w-xl" />
            <Skeleton className="h-8 w-full max-w-2xl" />
            <Skeleton className="m-10 h-8 w-full max-w-xl" />
          </div>
        </div>
      </section>
    </>
  )
}
