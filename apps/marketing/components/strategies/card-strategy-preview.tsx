import * as React from "react"
import { Card, CardHeader } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { LinkComponent } from "../shared/link-component"
import { env } from "@/env.mjs"

type CardStrategyPreview = React.HTMLAttributes<HTMLElement> & {
  id?: string
  alias?: string
  name: string
  description: string
}

export const CardStrategyPreview = ({
  className,
  id,
  name,
  description,
}: CardStrategyPreview) => {
  const classes = cn(
    className,
    "flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200"
  )

  return (
    <LinkComponent href={`${env.NEXT_PUBLIC_WEB3_APP_URL}/strategy/${id}`}>
      <Card className={classes}>
        <CardHeader className="relative overflow-hidden lg:pt-10">
          <div className="z-10">
            <h3 className="text-3xl font-bold">{name}</h3>
            <p className="mt-3">{description}</p>
          </div>
        </CardHeader>
      </Card>
    </LinkComponent>
  )
}
