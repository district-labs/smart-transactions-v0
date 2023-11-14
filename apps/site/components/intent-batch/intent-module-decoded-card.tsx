import * as React from "react"
import type {
  IntentModuleDecoded,
  IntentModuleDecodedArgs,
} from "@district-labs/intentify-intent-batch"
import { Card, CardContent, CardHeader } from "@district-labs/ui-react"

import { cn } from "@/lib/utils"

import { Row } from "../shared/row"

type IntentModuleDecodedCard = React.HTMLAttributes<HTMLElement> & {
  data: IntentModuleDecoded
}

export const IntentModuleDecodedCard = ({
  className,
  data,
}: IntentModuleDecodedCard) => {
  const classes = cn(className)

  return (
    <Card className={classes}>
      <CardHeader>
        <h3 className="text-2xl font-bold">{data.name}</h3>
        <Row label="Target" classNameValue="font-bold" value={data.target} />
      </CardHeader>
      <hr className="mb-4" />
      <CardContent>
        <div className="grid gap-y-2">
          {data?.intentArgs?.map(
            (input: IntentModuleDecodedArgs, i: number) => (
              <IntentArgument key={i} {...input} />
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const IntentArgument = ({ name, type, value }: IntentModuleDecodedArgs) => {
  return (
    <div className="">
      <Row label={name} classNameValue="font-medium" value={value} />
    </div>
  )
}
