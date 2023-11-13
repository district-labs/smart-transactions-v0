import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

import * as schema from "../schema";

export function getSelectAllIntentBatchExecutionQuery(
  db: PlanetScaleDatabase<typeof schema>,
) {
  const selectAllIntentBatchExecutionQuery =
    db.query.intentBatchExecution.findMany({
      with: {
        intentBatch: {
          with: {
            intents: true,
          },
        },
      },
    });

  return selectAllIntentBatchExecutionQuery;
}
