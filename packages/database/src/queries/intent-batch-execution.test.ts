import { expect, test } from "vitest";
import { db } from "..";
import { getSelectAllIntentBatchExecutionQuery } from "./intent-batch-execution";

test("should query intent batch executions", async () => {
  const query = await getSelectAllIntentBatchExecutionQuery(db).execute();
  expect(query.length).toBeGreaterThan(0);
});
