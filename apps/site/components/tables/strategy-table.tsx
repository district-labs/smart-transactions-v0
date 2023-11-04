"use client"

import { useGetSafeAddress } from "@district-labs/intentify-core-react"

import { useIntentBatchUserFind } from "@/hooks/intent-batch/user/use-intent-batch-user-find"
import { DataTable } from "@/components/data-table/data-table"

interface StrategyTable {
  strategyId: string
  pageCount: number
  columns: any
  filterData?: (data: any) => any
  transformData?: (data: any) => any
}

export function StrategyTable({
  strategyId,
  pageCount,
  columns,
  filterData,
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
          : filterData
          ? data.filter(filterData).map(transformData)
          : data.map(transformData)
      }
      pageCount={pageCount}
    />
  )
}
