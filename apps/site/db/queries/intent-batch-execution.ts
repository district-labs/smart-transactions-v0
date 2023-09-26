import { db } from ".."

export const selectAllIntentBatchQuery = db.query.intentBatchExecution.findMany(
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
