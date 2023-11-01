import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

import * as schema from "../schema";

// ----------------------------------------
// Select All Intent Batch Query
// ----------------------------------------

export function getSelectAllIntentBatchQuery(db: PlanetScaleDatabase<typeof schema>) {
const selectAllIntentBatchQuery = db.query.intentBatch.findMany({
  with: {
    intents: true,
    intentBatchExecution: {
      with: {
        hooks: true,
      },
    },
  },
})

return selectAllIntentBatchQuery
}

// ----------------------------------------
// Select All Valid Intent Batch Query
// ----------------------------------------
export function getSelectAllValidIntentBatchQuery(
  db: PlanetScaleDatabase<typeof schema>
) {
  const selectAllValidIntentBatchQuery = db.query.intentBatch.findMany({
  with: {
    intents: {
      where(fields, {eq}) {
        return eq(fields.isInvalid, false)
      },
    },
    intentBatchExecution: {
      with: {
        hooks: true,
      },
    },
  },
})
  
    return selectAllValidIntentBatchQuery
}

export type IntentBatchQuery = Awaited<
  ReturnType<ReturnType<typeof getSelectAllValidIntentBatchQuery>["execute"]>
>[number]

export type SelectAllIntentBatchQuery = Awaited<
ReturnType<ReturnType<typeof getSelectAllIntentBatchQuery>["execute"]>
>
export type SelectOneIntentBatchQuery = Awaited<
ReturnType<ReturnType<typeof getSelectAllIntentBatchQuery>["execute"]>
>[number]

// ----------------------------------------
// Select Active Intent Batch Query
// ----------------------------------------
export function getSelectIntentBatchActiveQuery(db: PlanetScaleDatabase<typeof schema>) {
const selectIntentBatchActiveQuery = db.query.intentBatch.findMany({
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

return selectIntentBatchActiveQuery
}


export type DBIntentBatchActiveQuery = Awaited<
ReturnType<ReturnType<typeof getSelectIntentBatchActiveQuery>["execute"]>
>

export type DBIntentBatchActiveItem = Awaited<
ReturnType<ReturnType<typeof getSelectIntentBatchActiveQuery>["execute"]>
>[number]

// ----------------------------------------
// Select Cancelled Intent Batch Query
// ----------------------------------------
export function getSelectIntentBatchCancelledQuery(db: PlanetScaleDatabase<typeof schema>) {
 const selectIntentBatchCancelledQuery = db.query.intentBatch.findMany({
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

return selectIntentBatchCancelledQuery

}
export type DBIntentBatchCancelledQuery = Awaited<
ReturnType<ReturnType<typeof getSelectIntentBatchCancelledQuery>["execute"]>
>

export type DBIntentBatchCancelledItem = Awaited<
ReturnType<ReturnType<typeof getSelectIntentBatchCancelledQuery>["execute"]>
>[number]
