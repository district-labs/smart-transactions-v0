import type { DbIntentBatch } from "@district-labs/intentify-database";
import { and, db, eq, intentBatch, intents } from "@district-labs/intentify-database";

/**
 * Fetches valid IntentBatches from the database based on the provided filters.
 * @param filters - Optional filters to apply to the query.
 * @returns - Array of IntentBatch matching the filters.
 */
export const getValidIntentBatchesFromDB = async (
  filters: Partial<Omit<DbIntentBatch, "id" | "updatedAt">>
): Promise<DbIntentBatch[]> => {

  let filtersToApply: any = []
  if(filters.root) {
    filtersToApply.push(eq(intentBatch.root, filters.root))
  }
  if(filters.strategyId) {
    filtersToApply.push(eq(intentBatch.strategyId, filters.strategyId))
  }

  return db.query.intentBatch.findMany({
    where: !filtersToApply ? undefined : () => and(...filtersToApply),
    with: {
      intents: {
        where(fields, {eq}) {
          return eq(fields.isInvalid, false)
        },
      },
      intentBatchExecution: {
        with: {
          hooks: true,
        },
      },
    },
  })
};

/**
 * Fetches a IntentBatch by ID.
 * @param userId - The ID of the IntentBatch to fetch.
 * @returns - IntentBatch matching the provided ID.
 */
export const getIntentBatchFromDB = async (intentBatchId: string): Promise<DbIntentBatch[]> => {
  return await db.select().from(intentBatch).where(eq(intentBatch.intentBatchHash, intentBatchId));
};

/**
 * Inserts a new IntentBatch into the database.
 * @param newIntentBatch - The IntentBatch to insert.
 * @returns - Response
 */
export const createIntentBatchInDB = async ({
  chainId,
  intentBatchHash,
  nonce,
  root,
  userId,
  signature,
  intentsDecoded,
  strategyId,
}: {
  chainId: number;
  intentBatchHash: string;
  nonce: number;
  root: string;
  userId: string;
  signature: string;
  intentBatchNew: any;
  intentsDecoded: any;
  strategyId: string;
}): Promise<Response> => {

  await db.transaction(async (tx: any) => {
    // Insert the intent batch into the database
    await tx.insert(intentBatch).values({
      intentBatchHash: intentBatchHash,
      nonce,
      chainId: Number(chainId),
      root,
      signature,
      // TODO: Make this dynamic
      strategyId: strategyId,
      userId: userId,
    })
    
    // Insert the decoded intents into the database
    await tx.insert(intents).values(
      intentsDecoded.map((intentNew: any) => ({
        intentId: intentNew.intentId,
        intentArgs: intentNew.intentArgs,
        root: intentNew.root,
        target: intentNew.target,
        data: intentNew.data,
        intentBatchId: intentBatchHash,
      }))
    )
  })

  return new Response(JSON.stringify({ ok: true }))
};

