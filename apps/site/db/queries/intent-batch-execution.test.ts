import { expect, test } from "vitest"

import { selectAllIntentBatchExecutionQuery } from "./intent-batch-execution"

test("should query intent batch executions", async () => {
  const query = await selectAllIntentBatchExecutionQuery.execute()
  expect(query.length).toBeGreaterThan(0)
})
