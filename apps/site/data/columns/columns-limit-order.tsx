"use client"

import tokenList from "@/data/lists/token-list-testnet.json"
import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"

import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ERC20DetailsFromTokenList } from "@/components/erc20/erc20-details-from-token-list"
import { IntentBatchId } from "@/components/intent-batch/intent-batch-id"
import { IntentBatchNonceDetails } from "@/components/intent-batch/intent-batch-nonce-details"
import { IntentBatchTransactionsSheet } from "@/components/intent-batch/intent-batch-transactions-sheet"
import { TagIntentBatchState } from "@/components/intent-batch/tag-intent-batch-state"
import { TimeFromEpoch } from "@/components/shared/time-from-epoch"
import { StrategyTableActions } from "@/components/strategies/strategy-table-actions"

export const columnsLimitOrder = [
  // {
  //   accessorKey: "intentBatchHash",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Intent Batch ID" />
  //   ),
  //   cell: ({ row }: any) => (
  //     <IntentBatchId truncate id={row.original.intentBatchHash} />
  //   ),
  // },
  {
    accessorKey: "sell.asset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Sell" />
    ),
    cell: ({ row }: any) => (
      <div className="min-w-[420px]">
        <ERC20DetailsFromTokenList
          tokenList={tokenList}
          address={row.original.tokenOut as `0x${string}`}
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
          className="text-xl"
          address={row.original.tokenOut as `0x${string}`}
          balance={row.original.tokenOutAmount}
          chainId={row.original.chainId}
        />
      </div>
    ),
  },
  {
    accessorKey: "receive.asset",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Buy" />
    ),
    cell: ({ row }: any) => (
      <ERC20DetailsFromTokenList
        tokenList={tokenList}
        address={row.original.tokenIn as `0x${string}`}
      />
    ),
  },
  {
    accessorKey: "receive.amount",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Buy Amount" />
    ),
    cell: ({ row }: any) => (
      <ERC20ConvertBalance
        className="text-xl"
        address={row.original.tokenIn as `0x${string}`}
        balance={row.original.tokenInAmount}
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
  // {
  //   accessorKey: "status",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }: any) => <TagIntentBatchState state={row.original.status} />,
  // },
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
    accessorKey: "transactions",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Transactions" />
    ),
    cell: ({ row }: any) => (
      <IntentBatchTransactionsSheet transactions={row.original.executedTxs} />
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
