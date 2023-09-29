import * as React from "react"

import { cn } from "@/lib/utils"

import { Row } from "../shared/row"
import { Card, CardContent, CardHeader } from "../ui/card"

type LimitOrderIntent = React.HTMLAttributes<HTMLElement> & {
  tokenOut?: string
  amountOut?: string
  tokenIn?: string
  amountIn?: string
}

export const LimitOrderIntent = ({
  className,
  tokenOut,
  amountOut,
  tokenIn,
  amountIn,
}: LimitOrderIntent) => {
  const classes = cn(className)

  return (
    <Card className={classes}>
      <CardHeader>
        <h3 className="text-2xl font-bold">Swap Tokens Intent</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          <Row label="Token Out" value={tokenOut} />
          <Row label="Amount Out" value={amountOut} />
          <Row label="Token In" value={tokenIn} />
          <Row label="Amount In" value={amountIn} />
        </div>
      </CardContent>
    </Card>
  )
}
