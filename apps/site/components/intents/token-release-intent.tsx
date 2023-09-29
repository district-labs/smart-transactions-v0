import * as React from "react"

import { cn } from "@/lib/utils"

import { Row } from "../shared/row"
import { Card, CardContent, CardHeader } from "../ui/card"

type TokenReleaseIntent = React.HTMLAttributes<HTMLElement> & {
  token?: string
  amount?: string
}

export const TokenReleaseIntent = ({
  className,
  token,
  amount,
}: TokenReleaseIntent) => {
  const classes = cn(className)

  return (
    <Card className={classes}>
      <CardHeader>
        <h3 className="text-2xl font-bold">Token Release Intent</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          <Row label="Token" value={token} />
          <Row label="Amount" value={amount} />
        </div>
      </CardContent>
    </Card>
  )
}
