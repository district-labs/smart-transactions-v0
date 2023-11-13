import * as React from "react"
import { Button } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { LinkComponent } from "../shared/link-component"
import { Card, CardFooter, CardHeader } from "../ui/card"

type TeamStrategyCard = React.HTMLAttributes<HTMLElement> & {
  id?: string
  alias?: string
  name: string
  description: string
  chainsSupported: number[]
}

export const TeamStrategyCard = ({
  className,
  id,
  name,
  description,
}: TeamStrategyCard) => {
  const classes = cn(
    className,
    "flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200"
  )

  return (
    <Card className={classes}>
      <CardHeader className="relative overflow-hidden lg:pt-10">
        <div className="z-10">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="mt-3">{description}</p>
        </div>
      </CardHeader>
      <CardFooter className="flex gap-x-4 justify-self-end bg-card-footer pb-5 pt-4">
        <LinkComponent href={`/strategy/${id}`}>
          <Button>Strategy</Button>
        </LinkComponent>
        <Button variant="outline">Create Template</Button>
      </CardFooter>
    </Card>
  )
}
