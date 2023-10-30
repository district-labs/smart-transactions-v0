/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import { useGetSafeAddress } from "@district-labs/intentify-core-react"

import { type LimitOrderIntent } from "@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data"
import { useIntentBatchUserFind } from "@/hooks/intent-batch/user/use-intent-batch-user-find"
import { DataTable } from "@/components/data-table/data-table"

interface StrategyTable {
  strategyId: string
  pageCount: number
  columns: any
  transformData?: (data: any) => any
}

export function StrategyTable({
  strategyId,
  pageCount,
  columns,
  transformData,
}: StrategyTable) {
  const address = useGetSafeAddress()
  const { data, isSuccess } = useIntentBatchUserFind({
    filters: {
      root: address,
      strategyId: strategyId,
    },
  })

  return (
    <DataTable
      columns={columns}
      data={
        !isSuccess
          ? []
          :
            (data.map(transformData) as unknown as LimitOrderIntent[])
      }
      pageCount={pageCount}
    />
  )
}
