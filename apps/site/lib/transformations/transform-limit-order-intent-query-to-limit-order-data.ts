import { IntentBatchQuery } from "@/db/queries/intent-batch";
4
type LimitOrderIntent = {
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

export function transformLimitOrderIntentQueryToLimitOrderData(intentBatch: IntentBatchQuery): LimitOrderIntent {

    const { intents } = intentBatch

    // intents[0].intentArgs[0].

    if(intents.length < 2) throw new Error("Invalid Intent Batch")

    return {
        sell: {
            asset: String(intents[2]?.intentArgs[0]?.value),
            amount: Number(intents[2].intentArgs[2].value),
        },
        receive: {
            asset: String(intents[2].intentArgs[1].value),
            amount: Number(intents[2].intentArgs[3].value),
        },
        limitPrice: String(intents[1].intentArgs[1].value),
        expiry: String(intents[0].intentArgs[0].value),
        status: getStatus(intentBatch.executedAt, intentBatch.cancelledAt)
    }
}

function getStatus(executedAt: Date | null, cancelledAt: Date | null): "open" | "closed" | "canceled" {
    if (executedAt) {
        return "closed"
    } else if (cancelledAt) {
        return "canceled"
    } else {
        return "open"
    }
}