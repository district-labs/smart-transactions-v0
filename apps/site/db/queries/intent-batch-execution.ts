import { eq } from "drizzle-orm"

import { db } from ".."
import { intentBatchExecution } from "../schema"
import type { IntentBatchExecution } from "../schema"

export function newIntentExecutionBatch(ieb: IntentBatchExecution) {
  return db.insert(intentBatchExecution).values(ieb)
}

export type IntentExecutionBatchNew = Awaited<
  ReturnType<typeof newIntentExecutionBatch>
>

export function updateIntentExecutionBatch(
  id: number,
  ieb: IntentBatchExecution
) {
  return db
    .update(intentBatchExecution)
    .set(ieb)
    .where(eq(intentBatchExecution.id, id))
}

export type IntentExecutionBatchUpdate = Awaited<
  ReturnType<typeof updateIntentExecutionBatch>
>
