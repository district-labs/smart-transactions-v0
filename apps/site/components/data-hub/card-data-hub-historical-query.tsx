import * as React from "react"
import {
  CardContent,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import TimeFromEpoch from "../shared/time-from-epoch"
import { Card, CardFooter, CardHeader } from "../ui/card"

type CardDataHubHistoricalQuery = React.HTMLAttributes<HTMLElement> & {
  id: number | string
  chainId: number
  timestamp: number
  queriesTotal: number
  protocols: {
    name: string
    id: string
    image: string
  }[]
  queries: {
    type: string
    blockNumber: number
    metadata: any
  }[]
}

export const CardDataHubHistoricalQuery = ({
  className,
  chainId,
  timestamp,
  queriesTotal,
  protocols,
  queries,
}: CardDataHubHistoricalQuery) => {
  const classes = cn(
    className,
    "flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className={classes}>
          <CardHeader className="relative overflow-hidden text-neutral-700 lg:pt-10">
            <div className="z-10">
              <h3 className="text-4xl font-bold">{chainId}</h3>
              <span className="text-sm font-bold">chainId</span>
            </div>
            <p className="">
              <TimeFromEpoch type="DATETIME" length={2} date={timestamp} />
            </p>
          </CardHeader>
          <CardContent>
            <p className="">Total Queries: {queriesTotal}</p>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Zero-Knowledge Proof</SheetTitle>
          <SheetDescription>
            Overview of the Zero-Knowledge Proof query for the selected chainId.
          </SheetDescription>
        </SheetHeader>
        <hr className="my-4" />
        <div className="my-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Protocols</h2>
          <span className="text-sm font-bold">Total: {protocols.length}</span>
        </div>
        {protocols.map((protocol) => (
          <div key={protocol.id} className="flex items-center gap-x-2">
            <img src={protocol.image} alt={protocol.name} className="h-8 w-8" />
            <span>{protocol.name}</span>
          </div>
        ))}
        <div className="my-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Queries</h2>
          <span className="text-sm font-bold">Total: {queriesTotal}</span>
        </div>
        {queries.map((query) => (
          <Card key={query.type} className="">
            <CardHeader>
              <h3 className="text-xl font-medium">{query.type}</h3>
            </CardHeader>
            <CardContent>
              <p>BlockNumber: {query.blockNumber}</p>
            </CardContent>
          </Card>
        ))}
        <SheetFooter>
          <SheetClose asChild>hello world</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
