import {
  IntentBatchQuery,
  SelectAllIntentBatchQuery,
} from "@/db/queries/intent-batch"
import { intentifySafeModuleABI } from "@district-labs/intentify-utils"
import type { Hook } from "@district-labs/intentify-utils"

export function generateIntentBatchExecutionWithHooksFromIntentBatchQuery(
  intentBatch: IntentBatchQuery
) {
  const intentBatchExecution = {
    batch: {
      root: intentBatch.root,
      nonce: intentBatch.nonce,
      intents: intentBatch.intents,
    },
    signature: intentifySafeModuleABI,
    hooks: generateHooksForIntentBatch(intentBatch),
  }
  return intentBatchExecution
}

function generateHooksForIntentBatch(
  intentBatch: SelectAllIntentBatchQuery
): Hook[] {
  switch (intentBatch.intent) {
    case "0x00000000":
      return generateHooksForLimitOrderBasic(intentBatch.chainId)
    default:
      throw new Error(`No hooks for intentBatch ${intentBatch.id}`)
  }
}

function generateHooksForLimitOrderBasic(chainId: number) {
  // 1. Timestamp Intent == No Hook
  // 2. Token Release Intent == No Hook
  // 3. Limit Order Intent == Fill on Uniswap

  // TODO: Make magic happen with Uniswap V3 swaps
  return [
    {
      target: "0x",
      data: "0x",
    },
    {
      target: "0x",
      data: "0x",
    },
    {
      target: "0x",
      data: "0x",
    },
  ]
}
