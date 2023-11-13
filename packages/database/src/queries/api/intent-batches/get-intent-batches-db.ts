import { db } from "../../..";

interface GetIntentBatchesDbParams {
  limit: string | undefined;
  offset: string | undefined;
  root: string | undefined;
  strategyId: string | undefined;
  expandFields: string[];
}

export async function getIntentBatchesDb({
  limit,
  offset,
  expandFields,
  root,
  strategyId,
}: GetIntentBatchesDbParams) {
  const rootFilter = root ? { root } : undefined;

  const intentBatches = await db.query.intentBatch.findMany({
    limit: Number(limit),
    offset: Number(offset),
    where:
      root && strategyId
        ? (intentBatch, { eq, and }) =>
            and(
              eq(intentBatch.root, root),
              eq(intentBatch.strategyId, strategyId),
            )
        : root
        ? (intentBatch, { eq }) => eq(intentBatch.root, root)
        : strategyId
        ? (intentBatch, { eq }) => eq(intentBatch.strategyId, strategyId)
        : undefined,
    with: {
      intents: expandFields.includes("intents") ? true : undefined,
      executedTxs: expandFields.includes("executedTxs") ? true : undefined,
      user: expandFields.includes("user") ? true : undefined,
      strategy: expandFields.includes("strategy") ? true : undefined,
    },
  });

  return intentBatches;
}
