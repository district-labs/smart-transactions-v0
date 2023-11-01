import { and, eq } from 'drizzle-orm';
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { intentBatch, type DbIntentBatch } from "../";
import * as schema from "../schema";

export function newIntentBatch(db: PlanetScaleDatabase<typeof schema>, intentBatchNew: DbIntentBatch) {
  return db.insert(intentBatch).values(intentBatchNew)
}

export type IntentBatchNew = Awaited<ReturnType<typeof newIntentBatch>>

// ----------------------------------------------
// Intent Batch Executed
// ----------------------------------------------
export function updateIntentBatchExecuted(
  db: PlanetScaleDatabase<typeof schema>,
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
  db: PlanetScaleDatabase<typeof schema>,
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
export function dbDeleteAllIntentBatches(db: PlanetScaleDatabase<typeof schema>) {
  return db.delete(intentBatch)
}

export type DBDeleteAllIntentBatches = Awaited<
  ReturnType<typeof dbDeleteAllIntentBatches>
>
