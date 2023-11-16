import { db } from "../../..";

interface GetIntentBatchDbParams {
  intentBatchHash: string;
  expandFields: string[];
}

export async function getIntentBatchDb({
  intentBatchHash,
  expandFields,
}: GetIntentBatchDbParams) {
  const existingIntentBatch = await db.query.intentBatch.findFirst({
    where: (intentBatch, { eq }) =>
      eq(intentBatch.intentBatchHash, intentBatchHash),
    with: {
      intents: expandFields.includes("intents") ? true : undefined,
      executedTxs: expandFields.includes("executedTxs") ? true : undefined,
      user: expandFields.includes("user") ? true : undefined,
      strategy: expandFields.includes("strategy") ? true : undefined,
    },
  });

  return existingIntentBatch;
}
