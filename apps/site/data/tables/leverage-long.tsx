"use client"

import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"
import {
  ERC20Name,
  ERC20Symbol,
} from "@/integrations/erc20/components/erc20-read"

import { Address } from "@/components/blockchain/address"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import TimeFromEpoch from "@/components/shared/time-from-epoch"

export const limitOrderTableColumns = [
  {
    accessorKey: "chainId",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Chain" />
    ),
  },
  {
    accessorKey: "sell.asset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Sell Token" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <ERC20Symbol
          className="font-bold"
          address={row.original.sell.asset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <span className="ml-2 text-xs">
          (
          <ERC20Name
            address={row.original.sell.asset as `0x${string}`}
            chainId={row.original.chainId}
          />
          )
        </span>
        <Address
          isLink
          className="ml-2 text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.sell.asset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "sell.amount",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Sell Amount" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <ERC20ConvertBalance
          address={row.original.sell.asset as `0x${string}`}
          balance={row.original.sell.amount}
          chainId={row.original.chainId}
        />
      </div>
    ),
  },
  {
    accessorKey: "receive.asset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Receive" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <ERC20Symbol
          className="font-bold"
          address={row.original.receive.asset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <span className="ml-2 text-xs">
          (
          <ERC20Name
            address={row.original.receive.asset as `0x${string}`}
            chainId={row.original.chainId}
          />
          )
        </span>
        <Address
          isLink
          className="ml-2 text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.receive.asset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "receive.amount",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Receive Amount" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <ERC20ConvertBalance
          address={row.original.receive.asset as `0x${string}`}
          balance={row.original.receive.amount}
          chainId={row.original.chainId}
        />
      </div>
    ),
  },
  {
    accessorKey: "executeAfter",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Execute After" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <TimeFromEpoch
          length={1}
          type="DATETIME"
          date={row.original.executeAfter}
        />
      </div>
    ),
  },
  {
    accessorKey: "executeBefore",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Execute Before" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <TimeFromEpoch
          length={1}
          type="DATETIME"
          date={row.original.executeBefore}
        />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        {/* <div className="flex gap-x-2">
              {row.original.status === "open" && (
                <CancelIntentBundle
                  intentBatch={row.original.intentBatch}
                  signMessageComponent={
                    <Button variant={"destructive"} type="button" size="sm">
                      Cancel
                    </Button>
                  }
                  signTransactionComponent={
                    <Button variant={"default"} type="button" size="sm">
                      Execute
                    </Button>
                  }
                />
              )}
              <SheetIntentBatchDetails data={row.original.intentBatchDb} />
            </div> */}
      </div>
    ),
  },
]
