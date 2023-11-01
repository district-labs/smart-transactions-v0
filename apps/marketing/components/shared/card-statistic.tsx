import * as React from "react"
import { Card, CardContent } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

type CardStatistic = React.HTMLAttributes<HTMLElement> & {
  label: string
  value: string
}

export const CardStatistic = ({ className, label, value }: CardStatistic) => {
  const classes = cn(className)

  return (
    <Card className={classes}>
      <CardContent className="flex flex-col space-y-2 p-4">
        <div className="text-3xl font-bold">{value || "Insert Value"}</div>
        <div className="text-xl text-foreground">{label || "Insert Label"}</div>
      </CardContent>
    </Card>
  )
}
