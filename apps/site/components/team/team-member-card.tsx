import * as React from "react"
import { Card, CardHeader } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { Blockie } from "../blockchain/blockie"

type TeamMemberCard = React.HTMLAttributes<HTMLElement> & {
  address: `0x${string}`
  firstName: string
  lastName: string
  role: string
}

export const TeamMemberCard = ({
  className,
  address,
  firstName,
  lastName,
  role,
}: TeamMemberCard) => {
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
            <h3 className="text-lg font-semibold">
              {firstName} {lastName}
            </h3>
            <h5 className="text-xs font-normal">{address}</h5>
          </div>
        </div>
        {role}
      </CardHeader>
    </Card>
  )
}
