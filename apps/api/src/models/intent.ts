import {
  db,
  eq,
  intents,
} from "@district-labs/intentify-database";

/**
 * Invalidate an Intent by ID.
 * @param userId - The ID of the IntentBatch to fetch.
 * @returns - IntentBatch matching the provided ID.
 */
export const invalidateIntentInDB = async (
  intentId: string,
) => {
    return await db
    .update(intents)
    .set({ isInvalid: true })
    .where(eq(intents.intentId, intentId));
};