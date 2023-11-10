import { generateIntentId } from "@district-labs/intentify-core";
import { DbIntent } from "@district-labs/intentify-database";
import { IntentValidation } from "@district-labs/intentify-intent-batch";
import { INTENT_INVALIDATION_RULES } from "../../../constants";
import { IntentBatchValidationStruct } from "../../../types";

export function invalidateIntentBatch(
  intentBatch: IntentBatchValidationStruct,
) {
  return intentBatch.invalidations
    .flatMap((invalidation) => {
      if (!invalidation) return null;
      const intentCanBeInvalidated = matchInvalidation(invalidation);
      if (!intentCanBeInvalidated) return null;
      const intent = intentBatch?.original?.intents?.find(
        (intent: DbIntent) =>
          intent.intentId === generateIntentId(invalidation?.name),
      );
      if (!intent) return null;
      return {
        intent: intent,
        invalidation: invalidation,
      };
    })
    .filter((value) => value !== null);
}

function matchInvalidation(invalidation: IntentValidation) {
  return INTENT_INVALIDATION_RULES.filter((invalidationType) => {
    if (invalidationType?.name === invalidation?.name) {
      const isInvalidForever = invalidation?.results?.errors?.every(
        (error: { index: number; msg: string }) => {
          return invalidationType.errorIndex.includes(error.index);
        },
      );
      return isInvalidForever;
    }
  })[0];
}
