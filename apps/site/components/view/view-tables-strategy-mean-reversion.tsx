/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as React from "react"
import { columnsMeanReversionBuy } from "@/data/columns/columns-mean-reversion-buy"
import { columnsMeanReversionSell } from "@/data/columns/columns-mean-reversion-sell"
import { transformToMeanReversionBuy } from "@/data/transforms/transform-to-mean-reversion-buy"
import { transformToMeanReversionSell } from "@/data/transforms/transform-to-mean-reversion-sell"

import { StrategyTable } from "../tables/strategy-table"

type ViewTablesStrategyMeanReversion = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
  overrideValues?: any
}

export const ViewTablesStrategyMeanReversion = ({
  strategyId,
}: ViewTablesStrategyMeanReversion) => {
  return (
    <div className="grid">
      <h3 className="text-3xl font-semibold">Buy</h3>
      <StrategyTable
        pageCount={10}
        strategyId={strategyId}
        columns={columnsMeanReversionBuy}
        transformData={transformToMeanReversionBuy}
        filterData={(intentBatch: any) => {
          return (
            intentBatch?.intents[0]?.intentId ===
            "0x4b4f50e797a888c701e67ef07b89cc4fbde80ee0e93333cd6463adc02b4e7eea"
          )
        }}
      />
      <h3 className="mt-10 text-3xl font-semibold">Sell</h3>
      <StrategyTable
        pageCount={10}
        strategyId={strategyId}
        columns={columnsMeanReversionSell}
        transformData={transformToMeanReversionSell}
        filterData={(intentBatch: any) => {
          return (
            intentBatch?.intents[0]?.intentId ===
            "0xa5d40abe64464a2721e5a44d4a29728e79ace12302492ae7bbde54019fda4d44"
          )
        }}
      />
    </div>
  )
}
