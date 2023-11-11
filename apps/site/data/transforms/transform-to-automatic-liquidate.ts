import { type IntentBatch } from "@district-labs/intentify-core"
import { type DbTransaction } from "@district-labs/intentify-database"

import { getStatus } from "./get-status"
import { transformIntentQueryToIntentBatchStruct } from "./transform-intent-query-to-intent-batch-struct"

export type AutomaticLiquidateIntent = {
  chainId: number
  executedTxs: DbTransaction[]
  nonce: string
  tokenOut: string
  minBalance: string
  balanceDelta: string
  status: "open" | "closed" | "canceled"
  intentBatch: IntentBatch
  intentBatchDb: any
}

export function transformToAutomaticLiquidate(intentBatch: any) {
  const { intents } = intentBatch
  return {
    chainId: Number(intentBatch.chainId),
    executedTxs: intentBatch.executedTxs,
    nonce: intentBatch.nonce,
    tokenOut: String(intents[0]?.intentArgs[0]?.value),
    tokenIn: String(intents[0]?.intentArgs[1]?.value),
    tokenOutPriceFeed: String(intents[0]?.intentArgs[2]?.value),
    tokenInPriceFeed: String(intents[0]?.intentArgs[3]?.value),
    thresholdSeconds: String(intents[0]?.intentArgs[4]?.value),
    minBalance: String(intents[0]?.intentArgs[5]?.value),
    balanceDelta: String(intents[0]?.intentArgs[6]?.value),
    status: getStatus(intentBatch.executedAt, intentBatch?.cancelledAt),
    intentBatch: transformIntentQueryToIntentBatchStruct(intentBatch),
    intentBatchDb: intentBatch,
  }
}
