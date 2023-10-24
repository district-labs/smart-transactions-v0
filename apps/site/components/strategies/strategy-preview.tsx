import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { BackgroundImage } from "../shared/background-image"
import { LinkComponent } from "../shared/link-component"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

type StrategyPreview = React.HTMLAttributes<HTMLElement> & {
  id?: string
  alias?: string
  name: string
  description: string
  createdBy: {
    name: string
    pfp: string
  }
}

export const StrategyPreview = ({
  className,
  id,
  alias,
  name,
  description,
  createdBy,
}: StrategyPreview) => {
  const classes = cn(
    className,
    "flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200"
  )

  return (
    <LinkComponent href={`/strategy/${id}`}>
      <Card className={classes}>
        <CardHeader className="relative overflow-hidden text-neutral-700 lg:pt-10">
          {/* <BackgroundImage image={image} /> */}
          <div className="z-10">
            <h3 className="text-3xl font-bold">{name}</h3>
            <p className="mt-3">{description}</p>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between gap-x-4 bg-neutral-50 pb-5 pt-4">
          <div className="text-right">
            <span className="text-xs font-bold">Created By</span>
          </div>
          <div className="flex items-center gap-x-2">
            {/* <span className='text-xs'>Created By</span> */}
            <img
              src={createdBy.pfp}
              className="inline-block h-5 w-5 rounded-full"
            />
            <span className="">{createdBy.name}</span>
          </div>
        </CardFooter>
      </Card>
    </LinkComponent>
  )
}
