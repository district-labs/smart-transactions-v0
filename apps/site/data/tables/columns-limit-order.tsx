"use client"

import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"
import { ERC20Symbol } from "@/integrations/erc20/components/erc20-read"

import { Address } from "@/components/blockchain/address"
import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { IntentBatchNonceDetails } from "@/components/intent-batch-nonce-details"
import { TagIntentBatchState } from "@/components/intent-batch/tag-intent-batch-state"
import { TimeFromEpoch } from "@/components/shared/time-from-epoch"
import { StrategyTableActions } from "@/components/strategies/strategy-table-actions"

export const columnsLimitOrder = [
  {
    accessorKey: "sell.asset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Out" />
    ),
    cell: ({ row }: any) => (
      <div className="flex flex-col gap-y-1">
        <ERC20Symbol
          className="font-bold"
          address={row.original.receive.asset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <Address
          isLink
          className="text-2xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.receive.asset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "sell.amount",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Out Amount" />
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
      <DataTableColumnHeader column={column} title="In" />
    ),
    cell: ({ row }: any) => (
      <div className="flex flex-col gap-y-1">
        <ERC20Symbol
          className="font-bold"
          address={row.original.receive.asset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <Address
          isLink
          className="text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.receive.asset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "receive.amount",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="In Amount" />
    ),
    cell: ({ row }: any) => (
      <ERC20ConvertBalance
        address={row.original.receive.asset as `0x${string}`}
        balance={row.original.receive.amount}
        chainId={row.original.chainId}
      />
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
          className="text-xs"
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
      <TimeFromEpoch
        className="text-xs"
        length={1}
        type="DATETIME"
        date={row.original.executeBefore}
      />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }: any) => <TagIntentBatchState state={row.original.status} />,
  },
  {
    accessorKey: "chainId",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Chain" />
    ),
    cell: ({ row }: any) => (
      <ChainIdToNetworkDetails chainId={row.original.chainId} />
    ),
  },
  {
    accessorKey: "nonce",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Nonce" />
    ),
    cell: ({ row }: any) => (
      <IntentBatchNonceDetails nonce={row.original.nonce} />
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }: any) => (
      <DataTableColumnHeader
        className="justify-end text-right"
        column={column}
        title="Actions"
      />
    ),
    cell: ({ row }: any) => (
      <div className="pr-3">
        <StrategyTableActions
          intentBatch={row.original.intentBatch}
          intentBatchQuery={row.original.intentBatchDb}
          status={row.original.status}
        />
      </div>
    ),
  },
]
