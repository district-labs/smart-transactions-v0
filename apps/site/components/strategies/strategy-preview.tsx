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
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

type StrategyPreview = React.HTMLAttributes<HTMLElement> & {
  name: string
  description: string
  image: string
  nonceType?: string
  modules?: string[]
  intentView?: React.ReactElement
}

export const StrategyPreview = ({
  className,
  name,
  description,
  image = "/images/story/limit-order.png",
  nonceType,
  modules,
  intentView,
}: StrategyPreview) => {
  const classes = cn(className, "flex flex-col overflow-hidden")

  return (
    <Card className={classes}>
      <CardHeader className="relative overflow-hidden bg-emerald-800 text-white lg:py-16">
        <BackgroundImage image={image} />
        <div className="z-10">
          <h3 className="text-3xl font-bold">{name}</h3>
          <p>{description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1"></CardContent>
      <CardFooter className="flex gap-x-4 pb-5">
        <Sheet>
          <SheetTrigger>
            <Button size={"sm"} className="text-sm">
              Create Transaction
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{name}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <hr className="my-4" />
            {intentView}
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger>
            <Button size={"sm"} variant={"outline"} className="text-sm">
              Details
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{name}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <hr className="my-4" />
            <span className="text-sm">
              <span className="font-bold">Nonce Type:</span> {nonceType}
            </span>
            {modules && modules.length > 0 && (
              <div>
                <h5 className="text-sm font-bold">Intent Modules</h5>
                <ul className="list-inside list-disc pl-3">
                  {modules.map((module, index) => (
                    <li key={index}>{module}</li>
                  ))}
                </ul>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  )
}
