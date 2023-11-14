import * as React from "react"
import { type Hex } from "viem"

import { cn } from "@/lib/utils"

type IntentBatchNonceType = React.HTMLAttributes<HTMLElement> & {
  nonce: Hex
}

export const IntentBatchNonceType = ({
  className,
  nonce,
}: IntentBatchNonceType) => {
  const classes = cn(className)
  if (nonce?.startsWith("0x00")) {
    return <span className={classes}>Standard</span>
  }

  if (nonce?.startsWith("0x01")) {
    return <span className={classes}>Dimensional</span>
  }

  if (nonce?.startsWith("0x02")) {
    return <span className={classes}>Time</span>
  }

  if (nonce?.startsWith("0x03")) {
    return <span className={classes}>Module</span>
  }

  return null
}
