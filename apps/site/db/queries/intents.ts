import { db } from ".."

export const selectAllIntentBatchQuery = db.query.intentBatch.findMany({
  with: {
    intentBatchExecution: {
      with: {
        hooks: true,
      },
    },
    intents: true,
    strategy: true,
  },
})

export type SelectAllIntentBatchExecutionQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>
export type SelectOneIntentBatchExecutionQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>[number]
