"use client"

import { DataTable } from "@/components/data-table/data-table"

import { columnsStrategyExecuted } from "./columns-strategy-executed-table"

interface IntentBatchTransactionsTable {
  data: any[]
  pageCount: number
}

export function IntentBatchTransactionsTable({
  data,
  pageCount,
}: IntentBatchTransactionsTable) {
  return (
    <DataTable
      columns={columnsStrategyExecuted}
      data={data}
      pageCount={pageCount}
    />
  )
}
