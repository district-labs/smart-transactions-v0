import { and, eq } from "drizzle-orm";
import { db, intentBatch } from "../../..";

interface GetIntentBatchesDbParams {
  limit?: string;
  offset?: string;
  root?: string
  strategyId?: string;
  expandFields: string[];
}

export async function getIntentBatchesDb({
  limit,
  offset,
  expandFields,
  root,
  strategyId,
}: GetIntentBatchesDbParams) {

  const filters: any[] = []

  if(root) {
    filters.push(eq(intentBatch.root, root))
  }

  if(strategyId) {
    filters.push(eq(intentBatch.strategyId, strategyId))
  }

  const intentBatches = await db.query.intentBatch.findMany({
    limit: Number(limit),
    offset: Number(offset),
    where: filters.length > 0 ? () => and(...filters) : undefined,
    with: {
      intents: expandFields.includes("intents") ? true : undefined,
      executedTxs: expandFields.includes("executedTxs") ? true : undefined,
      user: expandFields.includes("user") ? true : undefined,
      strategy: expandFields.includes("strategy") ? true : undefined,
    },
  });

  return intentBatches;
}
