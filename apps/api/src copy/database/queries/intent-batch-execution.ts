import { db } from "@district-labs/intentify-database"

export const selectAllIntentBatchExecutionQuery =
  db.query.intentBatchExecution.findMany({
    with: {
      intentBatch: {
        with: {
          intents: true,
        },
      },
    },
  })
