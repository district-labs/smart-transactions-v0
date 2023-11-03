import { type IntentBatch } from "@district-labs/intentify-core"

import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

export type RecurringPaymentIntent = {
  chainId: number
  tokenOut: string
  amountOut: number
  to: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
}

export function transformToRecurringPayment(intentBatch: any) {
  const { intents } = intentBatch
  return {
    chainId: Number(intentBatch.chainId),
    tokenOut: String(intents[0]?.intentArgs[0]?.value),
    amountOut: Number(intents[0]?.intentArgs[1]?.value),
    to: String(intents[0]?.intentArgs[2]?.value),
    executeBefore: String(intents[0]?.intentArgs[1]?.value),
    status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
    intentBatch: transformIntentQueryToIntentBatchStruct(intentBatch),
    intentBatchDb: intentBatch,
  }
}

function getStatus(
  executedAt: Date | null,
  cancelledAt: Date | null
): "open" | "closed" | "canceled" {
  if (executedAt) {
    return "closed"
  } else if (cancelledAt) {
    return "canceled"
  } else {
    return "open"
  }
}
