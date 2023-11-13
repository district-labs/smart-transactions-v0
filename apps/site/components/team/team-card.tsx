import * as React from "react"
import { Card, CardHeader } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { LinkComponent } from "../shared/link-component"
import { Statistic } from "../shared/statistic"

type TeamCard = React.HTMLAttributes<HTMLElement> & {
  id: string
  name?: string
  description?: string
  strategies?: any[]
  members?: any[]
}

export const TeamCard = ({
  className,
  id,
  name,
  description,
  strategies,
  members,
}: TeamCard) => {
  const classes = cn(className)

  return (
    <Card className={classes}>
      <LinkComponent href={`/team/${id}`}>
        <CardHeader className="grid grid-cols-2 gap-x-5">
          <div className="">
            <h3 className="text-3xl font-normal">{name}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
          </div>
          <div className="flex justify-end gap-x-10">
            <Statistic
              className="text-center"
              label="Strategies"
              value={strategies?.length || 0}
            />
            <Statistic
              className="text-center"
              label="Members"
              value={members?.length || 0}
            />
          </div>
        </CardHeader>
      </LinkComponent>
    </Card>
  )
}
