import { notFound } from "next/navigation"
import { db } from "@/db"
import { strategies, users } from "@/db/schema"
import { eq } from "drizzle-orm"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Icons } from "@/components/icons"
import StrategyActions from "@/components/strategies/strategy-actions"

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
      category: true,
      managerId: true,
    },
    where: eq(strategies.id, strategyId),
  })

  if (!strategy) {
    notFound()
  }

  const manager = await db.query.users.findFirst({
    columns: {
      address: true,
      firstName: true,
      about: true,
    },
    where: eq(users.address, strategy.managerId),
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
        {/* <StrategyOverview {...strategy} /> */}
        <StrategyActions strategy={strategy} />
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
                  {manager?.firstName || "Strategy Man"}
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
              {/* <TableRow>
                <TableCell>Size of Fund (millions)</TableCell>
                <TableCell className="text-right">{strategy.assets}</TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell className="text-right">
                  {strategy.category}
                </TableCell>
              </TableRow>
              {/* <TableRow>
                <TableCell>Fee Structure</TableCell>
                <TableCell className="text-right">
                  <span>Platform Fee - {strategy.platformFee}%</span>
                  <br />
                  <span>Performance Fee - {strategy.performanceFee}%</span>
                </TableCell>
              </TableRow> */}
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
