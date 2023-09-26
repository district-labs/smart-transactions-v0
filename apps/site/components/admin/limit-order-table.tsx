'use client'
import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTable } from "@/components/data-table/data-table"
import { Address } from "@/components/blockchain/address"
import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"
import { ERC20Name, ERC20Symbol } from "@/integrations/erc20/components/erc20-read"
import TimeFromEpoch from "@/components/shared/time-from-epoch"

interface LimitOrder {
  sell: {
    asset: string
    amount: number
  }
  receive: {
    asset: string
    amount: number
  }
  limitPrice: string
  expiry: string
  status: "open" | "closed" | "canceled"
}

interface LimitOrdersTableProps {
  data: LimitOrder[]
  pageCount: number
}

export function LimitOrdersTable({
  data,
  pageCount,
}: LimitOrdersTableProps) {
  const columns = useMemo<ColumnDef<LimitOrder, unknown>[]>(
    () => [
      {
        accessorKey: "sell.asset",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sell Token" />
        ),
        cell: ({ row }) => <div className="flex items-center">
          <ERC20Symbol className="font-bold" address={row.original.sell.asset as `0x${string}`} />
          <span className="ml-2 text-xs">(<ERC20Name address={row.original.sell.asset as `0x${string}`}/>)</span>
          <Address isLink className="ml-2 text-xs text-blue-500 hover:text-blue-600" truncate address={row.original.sell.asset as `0x${string}`} />
        </div>
      },
      {
        accessorKey: "sell.amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sell Amount" />
        ),
        cell: ({ row }) => <div className="flex items-center">
          <ERC20ConvertBalance address={row.original.sell.asset as `0x${string}`} balance={row.original.sell.amount} />
        </div>
      },
      {
        accessorKey: "receive.asset",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Receive" />
        ),
        cell: ({ row }) => <div className="flex items-center">
          <ERC20Symbol className="font-bold" address={row.original.receive.asset as `0x${string}`} />
          <span className="ml-2 text-xs">(<ERC20Name address={row.original.receive.asset as `0x${string}`}/>)</span>
          <Address isLink className="ml-2 text-xs text-blue-500 hover:text-blue-600" truncate address={row.original.receive.asset as `0x${string}`} />
        </div>
      },
      {
        accessorKey: "receive.amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Receive Amount" />
        ),
        cell: ({ row }) => <div className="flex items-center">
          <ERC20ConvertBalance address={row.original.receive.asset as `0x${string}`} balance={row.original.receive.amount} />
        </div>
      },
      {
        accessorKey: "expiry",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expiry" />
        ),
        cell: ({ row }) => <div className="flex items-center">
          <TimeFromEpoch length={1} type="DATETIME" date={row.original.expiry} />
        </div>
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
      },
    ],
    []
  )

  return <DataTable columns={columns} data={data} pageCount={pageCount} />
}
