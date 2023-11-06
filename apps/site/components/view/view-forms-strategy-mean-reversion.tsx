import * as React from "react"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import FormStrategyMeanReversionBuy from "../strategies/form-strategy-mean-reversion-buy"
import FormStrategyMeanReversionSell from "../strategies/form-strategy-mean-reversion-sell"

type ViewFormsStrategyMeanReversion = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
  overrideValues?: any
}

export const ViewFormsStrategyMeanReversion = ({
  children,
  className,
  strategyId,
  overrideValues = {},
}: ViewFormsStrategyMeanReversion) => {
  const classes = cn(className)

  return (
    <Tabs defaultValue="buy" className="w-full">
      <TabsList className="flex w-full gap-x-4">
        <TabsTrigger className="flex-1" value="buy">
          Buy
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="sell">
          Sell
        </TabsTrigger>
      </TabsList>
      <TabsContent value="buy">
        <FormStrategyMeanReversionBuy
          strategyId={strategyId}
          overrideValues={overrideValues}
        />
      </TabsContent>
      <TabsContent value="sell">
        <FormStrategyMeanReversionSell
          strategyId={strategyId}
          overrideValues={overrideValues}
        />
      </TabsContent>
    </Tabs>
  )
}
