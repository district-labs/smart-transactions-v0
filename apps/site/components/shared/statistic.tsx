import * as React from "react"

import { cn } from "@/lib/utils"

type Statistic = React.HTMLAttributes<HTMLElement> & {
  label: string
  value: string | number
}

export const Statistic = ({ className, label, value }: Statistic) => {
  const classes = cn(className)

  return (
    <div className={classes}>
      <div className="text-3xl font-bold">{`${value}`}</div>
      <div className="text-xl text-foreground">{label || "Insert Label"}</div>
    </div>
  )
}
