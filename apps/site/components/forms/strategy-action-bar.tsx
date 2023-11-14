import * as React from "react"
import { Copy } from "lucide-react"

import { cn } from "@/lib/utils"

import { ButtonCopyIntentBatchState } from "./button-copy-intent-batch-state"

type StrategyActionBar = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
  intentBatchData: any
}

export const StrategyActionBar = ({
  intentBatchData,
  className,
}: StrategyActionBar) => {
  const classes = cn("flex justify-end items-center mb-4 px-1", className)

  return (
    <div className={classes}>
      <ButtonCopyIntentBatchState intentBatchData={intentBatchData}>
        <span className="flex cursor-pointer items-center gap-x-2 text-xs font-bold hover:text-neutral-500">
          <Copy size={12} /> Share Smart Transaction
        </span>
      </ButtonCopyIntentBatchState>
    </div>
  )
}
