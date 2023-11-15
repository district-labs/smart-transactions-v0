import { type IntentBatch } from "@district-labs/intentify-core"
import { type DbIntentBatchWithRelations, type DbTransaction } from "@district-labs/intentify-database"

import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

export type RecurringPaymentIntent = {
  nonce: string
  executedTxs: DbTransaction[]
  chainId: number
  tokenOut: string
  amountOut: number
  to: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
  intentBatchDb: any
}

export function transformToRecurringPayment(
  intentBatch: DbIntentBatchWithRelations
): RecurringPaymentIntent {
  const intents = intentBatch?.intents

  return {
    chainId: Number(intentBatch.chainId),
    executedTxs: intentBatch?.executedTxs || [],
    nonce: intentBatch.nonce,
    tokenOut: String(intents?.[0]?.intentArgs[0]?.value),
    amountOut: Number(intents?.[0]?.intentArgs[1]?.value),
    to: String(intents?.[0]?.intentArgs[2]?.value),
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
