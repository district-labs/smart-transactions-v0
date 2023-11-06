"use client"

import {
    ERC20Image,
  ERC20Symbol,
} from "@/integrations/erc20/components/erc20-read"

import { Address } from "@/components/blockchain/address"
import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { IntentBatchNonceDetails } from "@/components/intent-batch-nonce-details"
import { TagIntentBatchState } from "@/components/intent-batch/tag-intent-batch-state"
import { StrategyTableActions } from "@/components/strategies/strategy-table-actions"
import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"
import Image from "next/image"

export const columnsAutomaticLiquidate = [
  {
    accessorKey: "tokenOut",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Sell" />
    ),
    cell: ({ row }: any) => (
    <div className='flex items-center gap-x-2'>
        <ERC20Image className="w-7 h-7" address={row.original.tokenOut as `0x${string}`} />
        <div className="flex flex-col gap-y-1">
          <ERC20Symbol
            className="font-bold"
            address={row.original.tokenOut as `0x${string}`}
            chainId={row.original.chainId}
          />
          <span className='flex items-center mt-1 gap-x-1'>
              <Image alt="Chainlink" src="/protocols/chainlink.png" width={14} height={14} />
              <Address
                isLink
                className="text-xs cursor-pointer"
                truncate
                address={row.original.tokenOutPriceFeed as `0x${string}`}
              />
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "balanceDelta",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Deposit Minimum" />
    ),
    cell: ({ row }: any) => (
        <ERC20ConvertBalance className="text-xl font-bold" balance={row.original.balanceDelta} address={row.original.tokenOut as `0x${string}`} chainId={row.original.chainId} />
    ),
  },
  {
    accessorKey: "minBalance",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Minimum Balance" />
    ),
    cell: ({ row }: any) => (
    <ERC20ConvertBalance className="text-xl font-bold" balance={row.original.minBalance} address={row.original.tokenOut as `0x${string}`} chainId={row.original.chainId} />
    ),
  },
  {
    accessorKey: "tokenIn",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Buy" />
    ),
    cell: ({ row }: any) => (
        <div className='flex items-center gap-x-2'>
        <ERC20Image className="w-7 h-7" address={row.original.tokenIn as `0x${string}`} />
        <div className="flex flex-col gap-y-1">
          <ERC20Symbol
            className="font-bold"
            address={row.original.tokenIn as `0x${string}`}
            chainId={row.original.chainId}
          />
          <span className='flex items-center mt-1 gap-x-1'>
              <Image alt="Chainlink" src="/protocols/chainlink.png" width={14} height={14} />
              <Address
                isLink
                className="text-xs cursor-pointer"
                truncate
                address={row.original.tokenInPriceFeed as `0x${string}`}
              />
          </span>
        </div>
      </div>
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
