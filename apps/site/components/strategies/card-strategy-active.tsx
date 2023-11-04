import * as React from "react"
import { ADDRESS_ZERO } from "@district-labs/intentify-core"
import { Button, CardContent } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { Address } from "../blockchain/address"
import { Blockie } from "../blockchain/blockie"
import { CardStatistic } from "../shared/card-statistic"
import { LinkComponent } from "../shared/link-component"
import { Card, CardFooter, CardHeader } from "../ui/card"

type CardStrategyActive = React.HTMLAttributes<HTMLElement> & {
  id?: string
  alias?: string
  name: string
  description: string
  manager: {
    address: `0x${string}`
    firstName: string
    lastName: string
  }
  totalIntentBatches?: number
  countTotal: number
  countPending: number
  countExecuted: number
  countCancelled: number
}

export const CardStrategyActive = ({
  className,
  id,
  name,
  description,
  manager,
  countTotal,
  countPending,
  countCancelled,
  countExecuted,
}: CardStrategyActive) => {
  const classes = cn(className, "flex flex-col")

  return (
    <Card className={classes}>
      <CardHeader className="relative overflow-hidden lg:pt-10">
        <div className="z-10">
          <h3 className="text-3xl font-bold">{name}</h3>
          <p className="mt-3">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <CardStatistic label="Pending" value={`${countPending}`} />
          <CardStatistic label="Executed" value={`${countExecuted}`} />
          <CardStatistic label="Cancelled" value={`${countCancelled}`} />
          <CardStatistic label="Total" value={`${countTotal}`} />
        </div>
        <LinkComponent href={`/strategy/${id}`}>
          <Button size="lg" className="mt-4 w-full">
            View Strategy
          </Button>
        </LinkComponent>
      </CardContent>
      <CardFooter className="flex justify-between gap-x-4 bg-card-footer pb-5 pt-4">
        <div className="text-right">
          <span className="text-xs font-bold">Created By</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="font-medium">
            {manager?.firstName} {manager?.lastName}
          </span>
          <Blockie
            address={manager?.address}
            className="h-6 w-6 rounded-full border-2 border-white shadow-md"
          />
          <Address address={manager?.address || ADDRESS_ZERO} truncate />
        </div>
      </CardFooter>
    </Card>
  )
}
