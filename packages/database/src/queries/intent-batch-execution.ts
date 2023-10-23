import { db } from "../index"

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
