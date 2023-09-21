import { db } from ".."

export const selectAllIntentBatchExecutionQuery =
  db.query.intentBatchExecution.findMany({
    with: {
      hooks: true,
      intentBatch: {
        with: {
          intents: true,
        },
      },
    },
  })

export type SelectAllIntentBatchExecutionQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchExecutionQuery.execute>
>
export type SelectOneIntentBatchExecutionQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchExecutionQuery.execute>
>[number]
