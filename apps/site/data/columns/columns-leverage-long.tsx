"use client"

import { ERC20Symbol } from "@/integrations/erc20/components/erc20-read"
import { formatUnits } from "viem"

import { bigIntToDecimal } from "@/lib/utils/big-int-to-decimals"
import { Address } from "@/components/blockchain/address"
import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { IntentBatchNonceDetails } from "@/components/intent-batch/intent-batch-nonce-details"
import { TagIntentBatchState } from "@/components/intent-batch/tag-intent-batch-state"
import { StrategyTableActions } from "@/components/strategies/strategy-table-actions"

export const columnsLeverageLong = [
  {
    accessorKey: "supplyAsset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Supply Asset" />
    ),
    cell: ({ row }: any) => (
      <div className="flex flex-col gap-y-1">
        <ERC20Symbol
          className="font-bold"
          address={row.original.supplyAsset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <Address
          isLink
          className="text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.supplyAsset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "borrowAsset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Supply Asset" />
    ),
    cell: ({ row }: any) => (
      <div className="flex flex-col gap-y-1">
        <ERC20Symbol
          className="font-bold"
          address={row.original.borrowAsset as `0x${string}`}
          chainId={row.original.chainId}
        />
        <Address
          isLink
          className="text-xs text-blue-500 hover:text-blue-600"
          truncate
          address={row.original.borrowAsset as `0x${string}`}
        />
      </div>
    ),
  },
  {
    accessorKey: "interestRateMode",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Interest Rate Mode" />
    ),
    cell: ({ row }: any) => (
      <>
        {row.original.interestRateMode == 1 && (
          <span className="text-xs">Variable</span>
        )}
        {row.original.interestRateMode == 2 && (
          <span className="text-xs">Stable</span>
        )}
      </>
    ),
  },
  {
    accessorKey: "minHealthFactor",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Min Health Factor" />
    ),
    cell: ({ row }: any) => (
      <>
        <span className="">
          {bigIntToDecimal(
            BigInt(formatUnits(row.original.minHealthFactor, 18)),
            2
          )}
        </span>
      </>
    ),
  },
  {
    accessorKey: "fee",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Execution Fee" />
    ),
    cell: ({ row }: any) => (
      <>
        <span className="">
          {bigIntToDecimal(BigInt(row.original.fee), 2)}%
        </span>
      </>
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
