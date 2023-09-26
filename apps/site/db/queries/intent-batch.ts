import { db } from ".."

// ----------------------------------------
// Select All Intent Batch Query
// ----------------------------------------
export const selectAllIntentBatchQuery = db.query.intentBatch.findMany({
  with: {
    intents: true,
    intentBatchExecution: true,
  },
})

export type IntentBatchQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>[number]

export type SelectAllIntentBatchQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>
export type SelectOneIntentBatchQuery = Awaited<
  ReturnType<typeof selectAllIntentBatchQuery.execute>
>[number]

// ----------------------------------------
// Select Active Intent Batch Query
// ----------------------------------------
export const selectIntentBatchActiveQuery = db.query.intentBatch.findMany({
  where: (intentBatch, { eq, isNull, and }) =>
    and(
      eq(intentBatch.cancelledAt, isNull(intentBatch.cancelledAt)),
      eq(intentBatch.executedAt, isNull(intentBatch.executedAt))
    ),
  with: {
    intents: true,
    intentBatchExecution: {
      with: {
        hooks: true,
      },
    },
  },
})

export type DBIntentBatchActiveQuery = Awaited<
  ReturnType<typeof selectIntentBatchActiveQuery.execute>
>

export type DBIntentBatchActiveItem = Awaited<
  ReturnType<typeof selectIntentBatchActiveQuery.execute>
>[number]

// ----------------------------------------
// Select Cancelled Intent Batch Query
// ----------------------------------------
export const selectIntentBatchCancelledQuery = db.query.intentBatch.findMany({
  where: (intentBatch, { eq, isNotNull, and }) =>
    and(eq(intentBatch.cancelledAt, isNotNull(intentBatch.cancelledAt))),
  with: {
    intents: true,
    intentBatchExecution: {
      with: {
        hooks: true,
      },
    },
  },
})

export type DBIntentBatchCancelledQuery = Awaited<
  ReturnType<typeof selectIntentBatchCancelledQuery.execute>
>

export type DBIntentBatchCancelledItem = Awaited<
  ReturnType<typeof selectIntentBatchCancelledQuery.execute>
>[number]
