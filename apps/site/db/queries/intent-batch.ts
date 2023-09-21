import { db } from ".."

export const selectAllIntentBatchQuery = db.query.intentBatchRelations.findMany(
  {
    with: {
      intentBatch: {
        with: {
          intents: true,
        },
      },
    },
  }
)

export type SelectAllIntentBatchQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>
export type SelectOneIntentBatchQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>[number]
