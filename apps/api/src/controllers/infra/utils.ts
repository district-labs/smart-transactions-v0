import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database";
import { DbIntent } from "@district-labs/intentify-database";
import { IntentBatch, generateIntentId } from "@district-labs/intentify-core";
import { IntentValidation } from '@district-labs/intentify-intent-batch' 
import { INTENT_INVALIDATION_RULES } from "../../constants";

export type IntentBatchValidationStruct = {
  original: DbIntentBatchWithRelations
  raw: IntentBatch
  invalidations: IntentValidation[]
}

export function invalidateIntentBatch(intentBatch: IntentBatchValidationStruct) {
  return intentBatch.invalidations.map((invalidation) => {
    const intentCanBeInvalidated = matchInvalidation(invalidation)
    if(!intentCanBeInvalidated) return null
    const intent = intentBatch?.original?.intents?.find((intent: DbIntent) => intent.intentId === generateIntentId(invalidation.name))
    if(!intent) return null
    return {
      intent: intent,
      invalidation: invalidation
    }
  }).flat().filter((value) => value !== null)
}

function matchInvalidation(invalidation: IntentValidation) {
  return INTENT_INVALIDATION_RULES.filter((invalidationType) => {
    if(invalidationType.name === invalidation.name) {
      const isInvalidForever = invalidation?.results?.errors?.every((error: {
        index: number
        msg: string
      }) => {
        return invalidationType.errorIndex.includes(error.index)
      })
      return isInvalidForever
    }
  })[0]
}