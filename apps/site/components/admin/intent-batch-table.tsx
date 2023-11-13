import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"

import { TimeFromDate } from "@/components/shared/time-from-date"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Address } from "../blockchain/address"
import { SheetIntentBatchDetails } from "./sheet-intent-batch-details"

type IntentBatchTable = {
  data: DbIntentBatchWithRelations[] | undefined
}

export function IntentBatchTable({ data }: IntentBatchTable) {
  return (
    <Table>
      <TableHeader className="bg-neutral-50">
        <TableRow>
          <TableHead>Chain</TableHead>
          <TableHead>Strategy ID</TableHead>
          <TableHead>Intent Batch Hash</TableHead>
          <TableHead>Smart Wallet</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Intent Count</TableHead>
          <TableHead>Executed At</TableHead>
          <TableHead>Cancelled At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((intentBatch) => (
          <TableRow key={intentBatch.intentBatchHash}>
            <TableCell>{intentBatch.chainId}</TableCell>
            <TableCell>{`${intentBatch.strategyId}`}</TableCell>
            <TableCell>{intentBatch.intentBatchHash}</TableCell>
            <TableCell>
              <Address truncate address={intentBatch.root as `0x${string}`} />
            </TableCell>
            <TableCell>
              <TimeFromDate
                length={1}
                type="DATETIME"
                date={intentBatch?.createdAt}
              />
            </TableCell>
            <TableCell>{intentBatch?.intents?.length}</TableCell>
            <TableCell>
              {intentBatch.executedAt ? (
                <TimeFromDate
                  length={1}
                  type="DATETIME"
                  date={intentBatch.executedAt}
                />
              ) : (
                "N/A"
              )}
            </TableCell>
            <TableCell>
              {intentBatch.cancelledAt ? (
                <TimeFromDate
                  length={1}
                  type="DATETIME"
                  date={intentBatch.cancelledAt}
                />
              ) : (
                "N/A"
              )}
            </TableCell>
            <TableCell>
              <SheetIntentBatchDetails data={intentBatch} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
