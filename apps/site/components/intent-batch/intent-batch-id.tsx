"use client"

import { type Hex } from "viem"

type IntentBatchId = React.HTMLAttributes<HTMLElement> & {
  id: Hex
  truncate?: boolean
  isLink?: boolean
}

export const IntentBatchId = ({ id, className, truncate }: IntentBatchId) => {
  const formattedTransaction = truncate
    ? `${id.slice(0, 6)}...${id.slice(-4)}`
    : id

  return <span className={className}>{formattedTransaction}</span>
}
