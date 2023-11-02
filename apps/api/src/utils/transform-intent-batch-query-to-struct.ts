import { IntentBatch } from "@district-labs/intentify-core"
import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database";
import { DbIntent } from "@district-labs/intentify-database"

export function transformIntentBatchQueryToStruct(
  intentBatch: DbIntentBatchWithRelations
) {
  const { intents } = intentBatch
  // TODO: check if the intent is a limit order intent by using the ID
  if(!intentBatch.root || !intentBatch.nonce) throw new Error('Invalid intent batch')
  return {
    chainId: intentBatch.chainId,
    original: intentBatch,
    raw: {
      root: intentBatch.root as `0x${string}`,
      nonce: intentBatch.nonce as `0x${string}`,
      intents: intents?.map((intent: DbIntent) => {
        return {
          root: intent.root as `0x${string}`,
          data: intent.data as `0x${string}`,
          target: intent.target as `0x${string}`,
          value: intent.value ? BigInt(intent.value) : BigInt(0),
        }
      }),
    }
  }
}