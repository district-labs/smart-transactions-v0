import { type IntentBatch } from "@district-labs/intentify-core"

import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

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
  executeAfter: string
  executeBefore: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
}

export function transformToLimitOrder(intentBatch: any) {
  const { intents } = intentBatch
  return {
    chainId: Number(intentBatch.chainId),
    sell: {
      asset: String(intents[1]?.intentArgs[0]?.value),
      amount: Number(intents[1]?.intentArgs[2]?.value),
    },
    receive: {
      asset: String(intents[1]?.intentArgs[1]?.value),
      amount: Number(intents[1]?.intentArgs[3]?.value),
    },
    limitPrice: String(0),
    executeAfter: String(intents[0]?.intentArgs[0]?.value),
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
