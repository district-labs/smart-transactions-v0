import { IntentBatchExecution } from "@district-labs/intentify-utils"

export function convertIntentBigIntToNumber(intentBatch: IntentBatchExecution) {
  const convertedIntents = intentBatch.batch.intents.map((intent) => {
    return {
      ...intent,
      value: Number(intent.value),
    }
  })

  return {
    ...intentBatch,
    batch: {
      ...intentBatch.batch,
      intents: convertedIntents,
    },
  }
}
