import * as React from "react"

import { cn } from "@/lib/utils"

type TagIntentBatchState = React.HTMLAttributes<HTMLElement> & {
  state: "open" | "cancelled" | "executed"
}

export const TagIntentBatchState = ({
  className,
  state,
}: TagIntentBatchState) => {
  const classes = cn(className)

  if (state === "open") {
    return (
      <span
        className={
          classes +
          "rounded-full bg-green-200 p-1 px-3 text-2xs font-medium dark:bg-green-300 dark:text-black"
        }
      >
        Open
      </span>
    )
  }

  if (state === "cancelled") {
    return (
      <span
        className={
          classes +
          " rounded-full bg-orange-500 p-1 px-3 text-2xs font-medium text-white dark:bg-amber-700"
        }
      >
        Cancelled
      </span>
    )
  }

  if (state === "executed") {
    return (
      <span
        className={
          classes +
          " rounded-full bg-green-700 p-1 px-3 text-2xs font-medium text-white"
        }
      >
        Executed
      </span>
    )
  }

  return (
    <span
      className={
        classes + " rounded-full bg-gray-500 p-1 px-3 text-2xs font-medium"
      }
    >
      Unknown
    </span>
  )
}
