import { type IntentBatch } from "@district-labs/intentify-core"

import { getStatus } from "./get-status"
import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

export type MeanReversionIntent = {
  chainId: number
  nonce: string
  tokenOut: string
  tokenIn: string
  tokenInPriceFeed: string
  tokenOutPriceFeed: string
  amount: string
  thresholdSeconds: string
  uniswapV3Pool: string
  numeratorReferenceBlockOffset: string
  numeratorBlockWindow: string
  numeratorBlockWindowTolerance: string
  denominatorReferenceBlockOffset: string
  denominatorBlockWindow: string
  denominatorBlockWindowTolerance: string
  minPercentageDifference: string
  maxPercentageDifference: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
  intentBatchDb: any
}

export function transformToMeanReversionBuy(
  intentBatch: any
): MeanReversionIntent {
  const { intents } = intentBatch
  return {
    chainId: Number(intentBatch.chainId),
    nonce: intentBatch.nonce,
    tokenOut: String(intents[0]?.intentArgs[0]?.value),
    tokenIn: String(intents[0]?.intentArgs[1]?.value),
    tokenOutPriceFeed: String(intents[0]?.intentArgs[2]?.value),
    tokenInPriceFeed: String(intents[0]?.intentArgs[3]?.value),
    amount: String(intents[0]?.intentArgs[4]?.value),
    thresholdSeconds: String(intents[0]?.intentArgs[4]?.value),
    uniswapV3Pool: String(intents[1]?.intentArgs[0]?.value),
    numeratorReferenceBlockOffset: String(intents[1]?.intentArgs[1]?.value),
    numeratorBlockWindow: String(intents[1]?.intentArgs[2]?.value),
    numeratorBlockWindowTolerance: String(intents[1]?.intentArgs[3]?.value),
    denominatorReferenceBlockOffset: String(intents[1]?.intentArgs[4]?.value),
    denominatorBlockWindow: String(intents[1]?.intentArgs[5]?.value),
    denominatorBlockWindowTolerance: String(intents[1]?.intentArgs[6]?.value),
    minPercentageDifference: String(intents[1]?.intentArgs[7]?.value),
    maxPercentageDifference: String(intents[1]?.intentArgs[8]?.value),
    status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
    intentBatch: transformIntentQueryToIntentBatchStruct(intentBatch),
    intentBatchDb: intentBatch,
  }
}
