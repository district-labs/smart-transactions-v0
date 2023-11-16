import { eq } from "drizzle-orm";
import {
  DbInsertTransaction,
  db,
  intentBatch,
  intents,
  transaction,
} from "../../..";

interface CancelIntentBatchDbParams {
  intentBatchHash: string;
  transactionHash: string;
  transactionTimestamp: number;
}

export async function cancelIntentBatchDb({
  intentBatchHash,
  transactionHash,
  transactionTimestamp,
}: CancelIntentBatchDbParams) {
  try {
    await db
      .update(intentBatch)
      .set({
        cancelledTxHash: transactionHash,
        cancelledAt: new Date(transactionTimestamp),
      })
      .where(eq(intentBatch.intentBatchHash, intentBatchHash));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

type ExecuteIntentBatchDbParams = DbInsertTransaction;

export async function executeIntentBatchDb({
  chainId,
  intentBatchId,
  blockHash,
  blockNumber,
  to,
  transactionHash,
}: ExecuteIntentBatchDbParams) {
  try {
    await db.insert(transaction).values({
      intentBatchId,
      to,
      chainId,
      blockHash,
      blockNumber,
      transactionHash,
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

interface InvalidateIntentBatchDbParams {
  intentId: string;
}

export async function invalidateIntentsDb({
  intentId,
}: InvalidateIntentBatchDbParams) {
  try {
    await db
      .update(intents)
      .set({ isInvalid: true })
      .where(eq(intents.intentId, intentId));

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
