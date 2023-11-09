import { type IntentBatch } from "@district-labs/intentify-core"

import { getStatus } from "./get-status"
import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

export type LimitOrderIntent = {
  chainId: number
  nonce: string
  tokenOut: string
    tokenIn: string
    tokenOutAmount: number
    tokenInAmount: number
  limitPrice: string
  executeAfter: string
  executeBefore: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
  intentBatchDb: any
}

export function transformToLimitOrder(intentBatch: any): LimitOrderIntent {
  const { intents } = intentBatch
  return {
    chainId: Number(intentBatch.chainId),
    nonce: intentBatch.nonce,
    tokenOut: String(intents[1]?.intentArgs[0]?.value),
    tokenIn: String(intents[1]?.intentArgs[1]?.value),
    tokenOutAmount: intents[1]?.intentArgs[2]?.value,
    tokenInAmount: intents[1]?.intentArgs[3]?.value,
    limitPrice: String(0),
    executeAfter: String(intents[0]?.intentArgs[0]?.value),
    executeBefore: String(intents[0]?.intentArgs[1]?.value),
    status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
    intentBatch: transformIntentQueryToIntentBatchStruct(intentBatch),
    intentBatchDb: intentBatch,
  }
}
