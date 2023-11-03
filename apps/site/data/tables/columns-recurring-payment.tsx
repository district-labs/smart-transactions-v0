"use client"

import {
  ERC20Name,
  ERC20Symbol,
} from "@/integrations/erc20/components/erc20-read"
import { Address } from "@/components/blockchain/address"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"

export const columnsRecurringPayment = [
  {
    accessorKey: "chainId",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Chain" />
    ),
  },
  {
    accessorKey: "tokenOut",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Token Transfer" />
    ),
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <ERC20Symbol
          className="font-bold"
          address={row.original.tokenOut as `0x${string}`}
          chainId={row.original.chainId}
        />
        <span className="ml-2 text-xs">
          (
          <ERC20Name
            address={row.original.tokenOut as `0x${string}`}
            chainId={row.original.chainId}
          />
          )
        </span>
        <Address
          isLink
          className="ml-2 text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.tokenOut as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "tokenOut",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Token Transfer" />
    ),
    cell: ({ row }: any) => (
      <ERC20ConvertBalance
          address={row.original.tokenOut as `0x${string}`}
          balance={row.original.amountOut}
          chainId={row.original.chainId}
        />
    ),
  },
  {
    accessorKey: "to",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="To" />
    ),
    cell: ({ row }: any) => (
        <Address
          isLink
          className="ml-2 text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.to as `0x${string}`}
        />
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
