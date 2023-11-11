import * as React from "react"
import { IntentBatch } from "@district-labs/intentify-core"
import { CancelIntentBundle } from "@district-labs/intentify-core-react"
import { IntentBatchQuery } from "@district-labs/intentify-database"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@district-labs/ui-react"
import { Info, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { SheetIntentBatchDetails } from "../intent-batch/intent-batch-details-sheet"

type StrategyTableActions = React.HTMLAttributes<HTMLElement> & {
  intentBatch: IntentBatch
  intentBatchQuery: IntentBatchQuery
  status: "open" | "cancelled" | "executed"
}

export const StrategyTableActions = ({
  className,
  intentBatch,
  intentBatchQuery,
  status,
}: StrategyTableActions) => {
  const classes = cn(className, "flex items-center justify-end gap-x-2")

  return (
    <TooltipProvider>
      <div className={classes}>
        {status === "open" && (
          <CancelIntentBundle
            intentBatch={intentBatchQuery}
            signMessageComponent={
              <Tooltip>
                <TooltipTrigger asChild>
                  <XCircle
                    size={16}
                    className="cursor-pointer text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-500"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cancel the smart transaction via onchain transaction</p>
                </TooltipContent>
              </Tooltip>
            }
            signTransactionComponent={
              <span className="flex gap-x-2">
                <span className="text-2xs">Execute</span>
              </span>
            }
          />
        )}
        <SheetIntentBatchDetails data={intentBatchQuery}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex cursor-pointer items-center gap-x-2 text-xs font-bold hover:text-neutral-500">
                <Info strokeWidth={1.75} size={16} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Details about the smart transaction</p>
            </TooltipContent>
          </Tooltip>
        </SheetIntentBatchDetails>
        {/* <ButtonCopyIntentBatchState
          intentBatchData={toObject(intentBatch)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer hover:text-emerald-700">
                <Copy size={16} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share the smart transaction via a link</p>
            </TooltipContent>
          </Tooltip>
        </ButtonCopyIntentBatchState> */}
      </div>
    </TooltipProvider>
  )
}
