import * as React from "react"

import { cn } from "@/lib/utils"

import TimeFromEpoch from "../shared/time-from-epoch"
import { Card, CardContent, CardHeader } from "../ui/card"

type TimestampRangeIntent = React.HTMLAttributes<HTMLElement> & {
  epoch: string
}

export const TimestampRangeIntent = ({
  className,
  epoch,
}: TimestampRangeIntent) => {
  const classes = cn(className)

  return (
    <Card className={classes}>
      <CardHeader>
        <h3 className="text-2xl font-bold">Timestamp Before Intent</h3>
      </CardHeader>
      <CardContent>
        <TimeFromEpoch type="DATETIME" length={4} date={epoch} />
      </CardContent>
    </Card>
  )
}
