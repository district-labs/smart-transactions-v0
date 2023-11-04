import { type IntentBatch } from "@district-labs/intentify-core"

import { getStatus } from "./get-status"
import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

type TransformToLeverageLong = {
  nonce: string
  chainId: number
  supplyAsset: string
  borrowAsset: string
  interestRateMode: string
  minHealthFactor: string
  fee: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
  intentBatchDb: any
}

export function transformToLeverageLong(
  intentBatch: any
): TransformToLeverageLong {
  const { intents } = intentBatch

  return {
    nonce: intentBatch.nonce,
    chainId: Number(intentBatch.chainId),
    supplyAsset: intents[0]?.intentArgs[0]?.value,
    borrowAsset: intents[0]?.intentArgs[1]?.value,
    interestRateMode: String(intents[0]?.intentArgs[2]?.value),
    minHealthFactor: String(intents[0]?.intentArgs[3]?.value),
    fee: String(intents[0]?.intentArgs[4]?.value),
    status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
    intentBatch: transformIntentQueryToIntentBatchStruct(intentBatch),
    intentBatchDb: intentBatch,
  }
}
