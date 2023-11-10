"use client"
import tokenList from "@/data/lists/vault-list-testnet.json"
import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { IntentBatchNonceDetails } from "@/components/intent-batch-nonce-details"
import { TagIntentBatchState } from "@/components/intent-batch/tag-intent-batch-state"
import { StrategyTableActions } from "@/components/strategies/strategy-table-actions"
import { ERC20ConvertBalance } from "@/integrations/erc20/components/erc20-convert-balance"
import { ERC20DetailsFromVaultList } from "@/components/erc20/erc20-details-from-vault-list"

export const columnsAutomaticSaving = [
  {
    accessorKey: "tokenOut",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Token" />
    ),
    cell: ({ row }: any) => (
      <ERC20DetailsFromVaultList vaultList={tokenList}  address={row.original.tokenOut as `0x${string}`} />
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
