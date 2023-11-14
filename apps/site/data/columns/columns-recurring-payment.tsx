"use client"

import tokenList from "@/data/lists/token-list-testnet.json"
import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"

import { Address } from "@/components/blockchain/address"
import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ERC20DetailsFromTokenList } from "@/components/erc20/erc20-details-from-token-list"
import { IntentBatchNonceDetails } from "@/components/intent-batch/intent-batch-nonce-details"
import { IntentBatchTransactionsSheet } from "@/components/intent-batch/intent-batch-transactions-sheet"
import { StrategyTableActions } from "@/components/strategies/strategy-table-actions"

export const columnsRecurringPayment = [
  {
    accessorKey: "tokenOut",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Token Transfer" />
    ),
    cell: ({ row }: any) => (
      <ERC20DetailsFromTokenList
        tokenList={tokenList}
        address={row.original.tokenOut as `0x${string}`}
      />
    ),
  },
  {
    accessorKey: "amountOut",
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
        className="text-xs text-blue-500 hover:text-blue-600"
        truncate
        address={row.original.to as `0x${string}`}
      />
    ),
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
