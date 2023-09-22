import { db } from ".."

export const selectAllIntentBatchQuery = db.query.intentBatch.findMany(
  {
    with: {
      intents: true,
    },
  }
)

export type IntentBatchQuery = Awaited<ReturnType<
  typeof selectAllIntentBatchQuery.execute
>>[number]

export type SelectAllIntentBatchQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>
export type SelectOneIntentBatchQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>[number]
