import { eq } from 'drizzle-orm';
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { hooks, intentBatchExecution, type DbIntentBatchExecution } from "..";
import * as schema from "../schema";


export function newIntentExecutionBatch(
  db: PlanetScaleDatabase<typeof schema>,
  intentBatchExecutionNew: DbIntentBatchExecution
) {
  return db.insert(intentBatchExecution).values(intentBatchExecutionNew)
}

export type IntentExecutionBatchNew = Awaited<
  ReturnType<typeof newIntentExecutionBatch>
>

export function updateIntentExecutionBatch(
  db: PlanetScaleDatabase<typeof schema>,
  id: number,
  ieb: DbIntentBatchExecution
) {
  return db
    .update(intentBatchExecution)
    .set(ieb)
    .where(eq(intentBatchExecution.id, id))
}

export type IntentExecutionBatchUpdate = Awaited<
  ReturnType<typeof updateIntentExecutionBatch>
>

interface CreateIntentExecutionBatchWithHooksParams {
  db: PlanetScaleDatabase<typeof schema>,
  intentBatchHash: string
  executor: string
  hooksNew: {
    target: string
    data: string
  }[]
}

export async function createIntentExecutionBatchWithHooks({
  db,
  intentBatchHash,
  executor,
  hooksNew,
}: CreateIntentExecutionBatchWithHooksParams) {
  await db.transaction(async (tx) => {
    const intentBatchResult = await tx.insert(intentBatchExecution).values({
      intentBatchId: intentBatchHash,
      executor,
    })

    await tx.insert(hooks).values(
      hooksNew.map((hook) => ({
        target: hook.target,
        data: hook.data,
        intentBatchExecutionId: Number(intentBatchResult.insertId),
      }))
    )
  })
}

// ----------------------------------------------
// Intent Batch Delete All
// ----------------------------------------------
export function dbDeleteAllDbIntentBatchExecutions(db: PlanetScaleDatabase<typeof schema>,) {
  return db.delete(intentBatchExecution)
}

export type DBDeleteAllDbIntentBatchExecutions = Awaited<
  ReturnType<typeof dbDeleteAllDbIntentBatchExecutions>
>
