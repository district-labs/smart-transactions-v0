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
  const cancelledIntentBatch = await db
    .update(intentBatch)
    .set({
      cancelledTxHash: transactionHash,
      cancelledAt: new Date(transactionTimestamp),
    })
    .where(eq(intentBatch.intentBatchHash, intentBatchHash));

  return cancelledIntentBatch;
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
  const insertedTransaction = await db.insert(transaction).values({
    intentBatchId,
    to,
    chainId,
    blockHash,
    blockNumber,
    transactionHash,
  });

  return insertedTransaction;
}

interface InvalidateIntentBatchDbParams {
  intentId: string;
}

export async function invalidateIntentsDb({
  intentId,
}: InvalidateIntentBatchDbParams) {
  const invalidatedIntent = await db
    .update(intents)
    .set({ isInvalid: true })
    .where(eq(intents.intentId, intentId));

  return invalidatedIntent;
}
