import { and, eq, inArray, notInArray } from "drizzle-orm";
import { db, intentBatch, intents } from "../../..";

type IntentBatchValidity = "valid" | "invalid" | "all";

interface GetIntentBatchesDbParams {
  limit?: string;
  offset?: string;
  root?: string;
  intentBatchValidity?: IntentBatchValidity;
  strategyId?: string;
  expandFields: string[];
}

export async function getIntentBatchesDb({
  limit,
  offset,
  expandFields,
  intentBatchValidity,
  root,
  strategyId,
}: GetIntentBatchesDbParams) {
  const filters: any[] = [];

  if (root) {
    filters.push(eq(intentBatch.root, root));
  }

  if (strategyId) {
    filters.push(eq(intentBatch.strategyId, strategyId));
  }

  /// Intent batch validity filter
  applyIntentBatchValidityFilter(filters, intentBatchValidity);

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

function applyIntentBatchValidityFilter(
  filters: any[],
  intentBatchValidity?: IntentBatchValidity,
) {
  // Retrieve only intent batches with valid intents is "valid" is provided
  if (intentBatchValidity === "valid") {
    filters.push(
      notInArray(
        intentBatch.intentBatchHash,
        db
          .select({ id: intents.intentBatchId })
          .from(intents)
          .where(eq(intents.isInvalid, true)),
      ),
    );
  } else if (intentBatchValidity === "invalid") {
    // Retrieve only intent batches with at least one invalid intent is "invalid" is provided
    filters.push(
      inArray(
        intentBatch.intentBatchHash,
        db
          .select({ id: intents.intentBatchId })
          .from(intents)
          .where(eq(intents.isInvalid, true)),
      ),
    );
  } else if (
    intentBatchValidity !== "all" &&
    intentBatchValidity !== undefined
  ) {
    // Throw an error if an invalid filter is provided
    throw new Error(`Invalid filter: ${intentBatchValidity}`);
  }
}
