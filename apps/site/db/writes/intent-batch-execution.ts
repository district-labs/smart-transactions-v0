import { eq } from "drizzle-orm"

import { db } from ".."
import { hooks, intentBatchExecution } from "../schema"
import type { DbIntentBatchExecution } from "../schema"

export function newIntentExecutionBatch(
  intentBatchExecutionNew: DbIntentBatchExecution
) {
  return db.insert(intentBatchExecution).values(intentBatchExecutionNew)
}

export type IntentExecutionBatchNew = Awaited<
  ReturnType<typeof newIntentExecutionBatch>
>

export function updateIntentExecutionBatch(
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

export async function createIntentExecutionBatchWithHooks(
  intentBatchId: number,
  hooksNew: {
    target: string
    data: string
  }[]
) {
  await db.transaction(async (tx) => {
    const intentBatchResult = await tx.insert(intentBatchExecution).values({
      intentBatchId: intentBatchId,
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
export function dbDeleteAllDbIntentBatchExecutions() {
  return db.delete(intentBatchExecution)
}

export type DBDeleteAllDbIntentBatchExecutions = Awaited<
  ReturnType<typeof dbDeleteAllDbIntentBatchExecutions>
>
