import { type IntentBatch } from "@district-labs/intentify-core"

import { getStatus } from "./get-status"
import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

export type AutomateLendingIntent = {
  chainId: number
  nonce: string
  tokenOut: string
  minBalance: string
  balanceDelta: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
  intentBatchDb: any
}

export function transformToAutomaticLending(intentBatch: any) {
  const { intents } = intentBatch
  return {
    chainId: Number(intentBatch.chainId),
    nonce: intentBatch.nonce,
    tokenOut: String(intents[0]?.intentArgs[0]?.value),
    minBalance: String(intents[0]?.intentArgs[1]?.value),
    balanceDelta: String(intents[0]?.intentArgs[2]?.value),
    status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
    intentBatch: transformIntentQueryToIntentBatchStruct(intentBatch),
    intentBatchDb: intentBatch,
  }
}
