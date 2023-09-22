import {
  IntentBatchQuery
} from "@/db/queries/intent-batch"
import type { Hook } from "@district-labs/intentify-utils"
import { generateHooksForLimitOrderBasic } from "./intent-hooks/generate-hooks-for-limit-order-basic"
import { splitSignature } from "./split-signature"

export function generateIntentBatchExecutionWithHooksFromIntentBatchQuery(
  intentBatch: IntentBatchQuery
) {
  const signatureSplit = splitSignature(intentBatch.signature)
  const intentBatchExecution = {
    batch: {
      root: intentBatch.root,
      nonce: intentBatch.nonce,
      intents: intentBatch.intents,
    },
    signature: {
      r: signatureSplit.r,
      s: signatureSplit.s,
      v: signatureSplit.v,
    },
    hooks: generateHooksForIntentBatch(intentBatch),
  }
  return intentBatchExecution
}

function generateHooksForIntentBatch(
  intentBatch: IntentBatchQuery
): Hook[] {
  switch (intentBatch.strategyId) {
    // case "limit-order-basic
    case 1:
      return generateHooksForLimitOrderBasic(intentBatch.chainId)
    default:
      throw new Error(`No hooks for intentBatch ${intentBatch.id}`)
  }
}

