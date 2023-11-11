import { type IntentBatch } from "@district-labs/intentify-core"
import type { IntentBatchQuery } from "@district-labs/intentify-database"

export function transformIntentQueryToIntentBatchStruct(
  intentBatch: IntentBatchQuery
): IntentBatch {
  const { intents } = intentBatch
  // TODO: check if the intent is a limit order intent by using the ID
  return {
    root: intentBatch.root as `0x${string}`,
    nonce: intentBatch.nonce as `0x${string}`,
    intents: intents.map((intent) => {
      return {
        root: intent.root as `0x${string}`,
        data: intent.data as `0x${string}`,
        target: intent.target as `0x${string}`,
        value: intent.value ? BigInt(intent.value) : BigInt(0),
      }
    }),
  }
}
