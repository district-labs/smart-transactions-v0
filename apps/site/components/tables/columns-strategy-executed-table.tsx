"use client"

import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

import { TransactionHash } from "../blockchain/transaction-hash"
import { IntentBatchId } from "../intent-batch/intent-batch-id"

export const columnsStrategyExecuted = [
  {
    accessorKey: "intentBatchId",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Intent Batch ID" />
    ),
    cell: ({ row }: any) => (
      <IntentBatchId truncate id={row.original.intentBatchId} />
    ),
  },
  {
    accessorKey: "transactionHash",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Transaction Hash" />
    ),
    cell: ({ row }: any) => (
      <TransactionHash
        truncate
        isLink
        transactionHash={row.original.transactionHash}
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
    accessorKey: "blockNumber",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="BlockNumber" />
    ),
  },
]
