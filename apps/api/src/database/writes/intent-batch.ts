import { db, intentBatch, eq, and } from "@district-labs/intentify-database"
import type { DbIntentBatch } from "@district-labs/intentify-database"

export function newIntentBatch(intentBatchNew: DbIntentBatch) {
  return db.insert(intentBatch).values(intentBatchNew)
}

export type IntentBatchNew = Awaited<ReturnType<typeof newIntentBatch>>

// ----------------------------------------------
// Intent Batch Executed
// ----------------------------------------------
export function updateIntentBatchExecuted(
  intentBatchHash: string,
  {
    executedAt,
    executedTxHash,
    chainId,
  }: {
    executedAt: Date
    executedTxHash: string
    chainId: number
  }
) {
  return db
    .update(intentBatch)
    .set({
      executedAt,
      executedTxHash,
    })
    .where(and(eq(intentBatch.intentBatchHash, intentBatchHash), eq(intentBatch.chainId, chainId)))
}

export type IntentBatchUpdateExecuted = Awaited<
  ReturnType<typeof updateIntentBatchExecuted>
>

// ----------------------------------------------
// Intent Batch Cancelled
// ----------------------------------------------
export function updateIntentBatchCancelled(
  intentBatchHash: string,
  {
    cancelledAt,
    cancelledTxHash,
    chainId,
  }: {
    cancelledAt: Date
    cancelledTxHash: string
    chainId: number
  }
) {
  return db
    .update(intentBatch)
    .set({
      cancelledAt,
      cancelledTxHash,
    })
    .where(and(eq(intentBatch.intentBatchHash, intentBatchHash), eq(intentBatch.chainId, chainId)))
}

export type IntentBatchUpdateCancelled = Awaited<
  ReturnType<typeof updateIntentBatchCancelled>
>

// ----------------------------------------------
// Intent Batch Delete All
// ----------------------------------------------
export function dbDeleteAllIntentBatches() {
  return db.delete(intentBatch)
}

export type DBDeleteAllIntentBatches = Awaited<
  ReturnType<typeof dbDeleteAllIntentBatches>
>
