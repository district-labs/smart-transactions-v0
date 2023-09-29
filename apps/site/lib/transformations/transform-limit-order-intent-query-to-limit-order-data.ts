import type { IntentBatchQuery } from "@/db/queries/intent-batch";
import { type IntentBatch } from "@district-labs/intentify-utils";
import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct";
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
    intentBatch: IntentBatch
    intentBatchDb: IntentBatchQuery
  }

export function transformLimitOrderIntentQueryToLimitOrderData(intentBatch: IntentBatchQuery): LimitOrderIntent {

    const { intents } = intentBatch


    // TODO: check if the intent is a limit order intent by using the ID
    return {
        chainId: Number(intentBatch.chainId),
        sell: {
            asset: String(intents[2]?.intentArgs[0]?.value),
            amount: Number(intents[2]?.intentArgs[2]?.value),
        },
        receive: {
            asset: String(intents[2]?.intentArgs[1]?.value),
            amount: Number(intents[2]?.intentArgs[3]?.value),
        },
        limitPrice: String(intents[1]?.intentArgs[1]?.value),
        expiry: String(intents[0]?.intentArgs[0]?.value),
        status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
        intentBatch: transformIntentQueryToIntentBatchStruct(intentBatch),
        intentBatchDb: intentBatch
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
