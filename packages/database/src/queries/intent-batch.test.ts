import { expect, test } from "vitest"
import { db } from ".."
import {
  getSelectAllIntentBatchQuery,
  getSelectIntentBatchActiveQuery,
  getSelectIntentBatchCancelledQuery,
} from "./intent-batch"

test("should query all intent batches", async () => {
  const query = await getSelectAllIntentBatchQuery(db).execute()
  expect(query.length).toBeGreaterThan(0)
})

test("should query active intent batches", async () => {
  const query = await getSelectIntentBatchActiveQuery(db).execute()
  expect(query.length).toBeGreaterThan(0)
})

test("should query cancelled intent batches", async () => {
  const query = await getSelectIntentBatchCancelledQuery(db).execute()
  expect(query.length).toBeGreaterThan(0)
})
