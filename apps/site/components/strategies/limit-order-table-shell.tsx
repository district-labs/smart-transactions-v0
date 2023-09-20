import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTable } from "../data-table/data-table"
import { DataTableColumnHeader } from "../data-table/data-table-column-header"

interface LimitOrder {
  sell: {
    asset: string
    amount: number
  }
  recieve: {
    asset: string
    amount: number
  }
  limitPrice: string
  expiry: string
  status: "open" | "closed" | "canceled"
}

interface OpenOrdersTableShellProps {
  data: LimitOrder[]
  pageCount: number
}

export function OpenOrdersTableShell({
  data,
  pageCount,
}: OpenOrdersTableShellProps) {
  const columns = useMemo<ColumnDef<LimitOrder, unknown>[]>(
    () => [
      {
        accessorKey: "sell.asset",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sell" />
        ),
      },
      {
        accessorKey: "recieve.asset",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Recieve" />
        ),
      },
      {
        accessorKey: "limitPrice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Limit Price" />
        ),
      },
      {
        accessorKey: "expiry",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expiry" />
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
      },
      {
        accessorKey: "action",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Action" />
        ),
      },
    ],
    [data]
  )

  return <DataTable columns={columns} data={data} pageCount={pageCount} />
}
