import * as React from "react"

import { cn } from "@/lib/utils"

import FormAaveLeverageLongIntent from "../forms/form-aave-leverage-long"

type ViewAaveLeverageLongIntent = React.HTMLAttributes<HTMLElement>

export const ViewAaveLeverageLongIntent = ({
  children,
  className,
}: ViewAaveLeverageLongIntent) => {
  const classes = cn(className)
  return (
    <div className={classes}>
      <FormAaveLeverageLongIntent />
    </div>
  )
}
