import { asc, eq, isNotNull, isNull, sql } from "drizzle-orm"
import { db } from ".."
import { intentBatch, intentBatchExecution, intents } from "../schema"

// ----------------------------------------
// Select All Intent Batch Query
// ----------------------------------------
export const selectAllIntentBatchQuery = db.query.intentBatch.findMany(
  {
    with: {
      intents: true,
      intentBatchExecution: true,
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

// ----------------------------------------
// Select All Intent Batch Query
// ----------------------------------------
export const selectActiveIntentBatchQuery = db.query.intentBatch.findMany(
  {
    where: (intentBatch, { eq, isNull, and}) => and(
      eq(intentBatch.cancelledAt, isNull(intentBatch.cancelledAt)), 
      eq(intentBatch.executedAt, isNull(intentBatch.executedAt))
    ),
    with: {
      intents: true,
      intentBatchExecution: {
        columns: {
          executedTxHash: true,
        },
        with: {
          hooks: true,
        },
      },
    },
  }
)

export type DBIntentBatchActiveQuery = Awaited<ReturnType<
  typeof selectActiveIntentBatchQuery.execute
>>

export type DBIntentBatchActiveItem = Awaited<
  ReturnType<typeof selectActiveIntentBatchQuery.execute>
>[number]

// ----------------------------------------
// Active Intent Batch Query
// ----------------------------------------
export const intentBatchActiveQuery = await db
.select({
  intentBatch: intentBatch,
  // intentBatchExecution: intentBatchExecution,
  intentsList: sql`GROUP_CONCAT(JSON_OBJECT(
    'id', intents.id,
    'root', intents.root,
    'target', intents.target,
    'data', intents.data,
    'value', intents.value
  )) AS intents`
})
.from(intentBatch)
.where(eq(intentBatch.cancelledTxHash, isNull(intentBatch.cancelledTxHash)))
.leftJoin(intentBatchExecution, eq(intentBatchExecution.executedTxHash, isNull(intentBatchExecution.executedTxHash)))
.leftJoin(intents, eq(intents.intentBatchId, intentBatch.id))
.groupBy(intentBatch.id) // Group by intentBatch.id
.orderBy(asc(intentBatch.createdAt))

export type SelectActiveIntentBatchQuery = Awaited<
  typeof intentBatchActiveQuery
>

export type SelectActiveIntentBatchQueryItem = Awaited<
  typeof intentBatchActiveQuery
>[number]

// ----------------------------------------
// Cancelled Intent Batch Query
// ----------------------------------------
export const intentBatchCancelledQuery = await db
.select({
  id: intentBatch.id,
  intentId: intents.id
})
.from(intentBatch)
.where(eq(intentBatch.cancelledTxHash, isNotNull(intentBatch.cancelledTxHash)))
.leftJoin(intents, eq(intents.intentBatchId, eq(intentBatch.id, intentBatch.id)))
.leftJoin(intentBatchExecution, eq(intentBatchExecution.executedTxHash, isNull(intentBatchExecution.executedTxHash)))
.orderBy(asc(intentBatch.createdAt))
