import * as React from "react"
import { CardContent } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { ChainsSupportedList } from "../shared/chain-supported-list"
import { LinkComponent } from "../shared/link-component"
import { Card, CardFooter, CardHeader } from "../ui/card"

type CardStrategyPreview = React.HTMLAttributes<HTMLElement> & {
  id?: string
  alias?: string
  name: string
  description: string
  chainsSupported: number[]
  createdBy: {
    name: string
    pfp: string
  }
}

export const CardStrategyPreview = ({
  className,
  id,
  name,
  description,
  createdBy,
  chainsSupported,
}: CardStrategyPreview) => {
  const classes = cn(
    className,
    "flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200"
  )

  return (
    <Card className={classes}>
      <LinkComponent
        href={`/strategy/${id}`}
        className="flex h-full flex-col justify-between"
      >
        <CardHeader className="relative overflow-hidden lg:pt-10">
          <div className="z-10">
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="mt-3">{description}</p>
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-x-2">
          <ChainsSupportedList
            className="flex items-center gap-x-2"
            chainsSupported={chainsSupported}
          />
        </CardContent>
        <CardFooter className="flex justify-between gap-x-4 justify-self-end bg-card-footer pb-5 pt-4">
          <div className="text-right">
            <span className="text-xs font-bold">Created By</span>
          </div>
          <div className="flex items-center gap-x-2">
            <img
              src={createdBy.pfp}
              className="inline-block h-5 w-5 rounded-full"
            />
            <span className="">{createdBy.name}</span>
          </div>
        </CardFooter>
      </LinkComponent>
    </Card>
  )
}
