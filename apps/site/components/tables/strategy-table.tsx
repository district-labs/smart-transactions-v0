"use client"

import { useIntentBatchUserFind } from "@/actions/user/use-intent-batch-user-find"

import {
  transformLimitOrderIntentQueryToLimitOrderData,
  type LimitOrderIntent,
} from "@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data"
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
}: StrategyTable) {
  const { data, isSuccess } = useIntentBatchUserFind({
    filters: {
      strategyId: strategyId,
    },
  })

  return (
    <DataTable
      columns={columns}
      data={
        !isSuccess
          ? []
          : (data.map(
              transformLimitOrderIntentQueryToLimitOrderData
            ) as unknown as LimitOrderIntent[])
      }
      pageCount={pageCount}
    />
  )
}
