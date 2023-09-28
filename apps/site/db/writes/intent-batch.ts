import { eq } from "drizzle-orm"

import { db } from ".."
import type { DbIntentBatch } from "../schema"
import { intentBatch } from "../schema"

export function newIntentBatch(intentBatchNew: DbIntentBatch) {
  return db.insert(intentBatch).values(intentBatchNew)
}

export type IntentBatchNew = Awaited<
  ReturnType<typeof newIntentBatch>
>

// ----------------------------------------------
// Update Intent Batch from ID
// ----------------------------------------------

export function updateIntentBatchFromDbId(
  intentBatchHash: string,
  intentBatchNew: DbIntentBatch
) {
  return db
    .update(intentBatch)
    .set(intentBatchNew)
    .where(eq(intentBatch.intentBatchHash, intentBatchHash))
}

export type IntentBatchUpdateFromDbId = Awaited<
  ReturnType<typeof updateIntentBatchFromDbId>
>

// ----------------------------------------------
// Intent Batch Executed
// ----------------------------------------------
export function updateIntentBatchExecuted(
    intentBatchHash: string,
    {
    executedAt,
    executedTxHash
    }: {
    executedAt: Date
    executedTxHash: string
    }
) {
  return db
    .update(intentBatch)
    .set({
        executedAt,
        executedTxHash
    })
    .where(eq(intentBatch.intentBatchHash, intentBatchHash))
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
        cancelledTxHash
    }: {
        cancelledAt: Date
        cancelledTxHash: string
    }
) {
  return db
    .update(intentBatch)
    .set({
        cancelledAt,
        cancelledTxHash
    })
    .where(eq(intentBatch.intentBatchHash, intentBatchHash))
}

export type IntentBatchUpdateCancelled = Awaited<
  ReturnType<typeof updateIntentBatchCancelled>
>

// ----------------------------------------------
// Intent Batch Delete All
// ----------------------------------------------
export function dbDeleteAllIntentBatches() {
  return db
    .delete(intentBatch)
}

export type DBDeleteAllIntentBatches = Awaited<
ReturnType<typeof dbDeleteAllIntentBatches>
>