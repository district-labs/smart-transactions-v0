import { type IntentBatch } from "@district-labs/intentify-core"
import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"

4
export type LimitOrderIntent = {
  chainId: number
  sell: {
    asset: string
    amount: number
  }
  receive: {
    asset: string
    amount: number
  }
  limitPrice: string
  expiry: string
  status: "open" | "closed" | "canceled"
}

export function transformIntentQueryToIntentBatchStruct(
  intentBatch: DbIntentBatchWithRelations
): IntentBatch {
  const { intents } = intentBatch
  // TODO: check if the intent is a limit order intent by using the ID
  return {
    root: intentBatch.root as `0x${string}`,
    nonce: intentBatch.nonce as `0x${string}`,
    intents:
      intents?.map((intent) => {
        return {
          root: intent.root as `0x${string}`,
          data: intent.data as `0x${string}`,
          target: intent.target as `0x${string}`,
          value: intent.value ? BigInt(intent.value) : BigInt(0),
        }
      }) || [],
  }
}
