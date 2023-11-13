import * as React from "react"
import { Button, Card, CardHeader } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { Blockie } from "../blockchain/blockie"

type TeamInviteCard = React.HTMLAttributes<HTMLElement> & {
  address: `0x${string}`
  role: string
}

export const TeamInviteCard = ({ className, address }: TeamInviteCard) => {
  const classes = cn(className)

  return (
    <Card className={classes}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Blockie
            address={address}
            className="h-10 w-10 rounded-full border-2 border-double border-white shadow-lg"
          />
          <div className="">
            <h3 className="text-lg font-semibold">{address}</h3>
          </div>
        </div>
        <Button size="sm" variant="destructive">
          Cancel
        </Button>
      </CardHeader>
    </Card>
  )
}
