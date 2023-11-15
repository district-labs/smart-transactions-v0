"use client"

import { useGetSafeAddress } from "@district-labs/intentify-core-react"

import { DataTable } from "@/components/data-table/data-table"
import { useIntentBatchUserFind } from "@/hooks/intent-batch/user/use-intent-batch-user-find"

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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
            ? data.filter(filterData).map(transformData)
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
            : data.map(transformData)
      }
      pageCount={pageCount}
    />
  )
}
