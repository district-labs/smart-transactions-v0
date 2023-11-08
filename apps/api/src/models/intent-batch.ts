import type {
  DbIntentBatchWithRelations
} from "@district-labs/intentify-database";
import {
  and,
  db,
  eq,
  inArray,
  intentBatch,
  intents,
  notInArray,
} from "@district-labs/intentify-database";

interface GetIntentBatchesFromDBFilter
  extends Partial<Omit<DbIntentBatchWithRelations, "id" | "updatedAt">> {
  intentBatchesValidity?: "valid" | "invalid" | "all";
}

function applyIntentBatchesValidityFilter(
  filtersToApply: any,
  intentBatchesValidity: GetIntentBatchesFromDBFilter["intentBatchesValidity"],
) {
  // Retrieve only intent batches with valid intents is "valid" is provided
  if (intentBatchesValidity === "valid") {
    filtersToApply.push(
      notInArray(
        intentBatch.intentBatchHash,
        db
          .select({ id: intents.intentBatchId })
          .from(intents)
          .where(eq(intents.isInvalid, true)),
      ),
    );
  } else if (intentBatchesValidity === "invalid") {
    // Retrieve only intent batches with at least one invalid intent is "invalid" is provided
    filtersToApply.push(
      inArray(
        intentBatch.intentBatchHash,
        db
          .select({ id: intents.intentBatchId })
          .from(intents)
          .where(eq(intents.isInvalid, true)),
      ),
    );
  } else if (
    intentBatchesValidity !== "all" &&
    intentBatchesValidity !== undefined
  ) {
    // Throw an error if an invalid filter is provided
    throw new Error(`Invalid filter: ${intentBatchesValidity}`);
  }
}

/**
 * Fetches IntentBatches from the database based on the provided filters.
 * @param filters - Optional filters to apply to the query.
 * @returns - Array of IntentBatch matching the filters.
 */
export const getIntentBatchesFromDB = async (
  filters: GetIntentBatchesFromDBFilter,
): Promise<DbIntentBatchWithRelations[]> => {
  const { root, strategyId, intentBatchesValidity } = filters;

  let filtersToApply: any = [];
  if (root) {
    filtersToApply.push(eq(intentBatch.root, root));
  }
  if (strategyId) {
    filtersToApply.push(eq(intentBatch.strategyId, strategyId));
  }

  /// Intent batches validity filter
  applyIntentBatchesValidityFilter(filtersToApply, intentBatchesValidity);

  return db.query.intentBatch.findMany({
    where: !filtersToApply ? undefined : () => and(...filtersToApply),
    with: {
      intents: true,
      intentBatchExecution: {
        with: {
          hooks: true,
        },
      },
    },
  });
};

/**
 * Fetches a IntentBatch by ID.
 * @param userId - The ID of the IntentBatch to fetch.
 * @returns - IntentBatch matching the provided ID.
 */
export const getIntentBatchFromDB = async (
  intentBatchId: string,
): Promise<DbIntentBatchWithRelations | undefined> => {
  return db.query.intentBatch.findFirst({
    where: eq(intentBatch.intentBatchHash, intentBatchId),
    with: {
      intents: true,
    }
  })
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
    });

    // Insert the decoded intents into the database
    await tx.insert(intents).values(
      intentsDecoded.map((intentNew: any) => ({
        intentId: intentNew.intentId,
        intentArgs: intentNew.intentArgs,
        root: intentNew.root,
        target: intentNew.target,
        data: intentNew.data,
        intentBatchId: intentBatchHash,
      })),
    );
  });

  return new Response(JSON.stringify({ ok: true }));
};
