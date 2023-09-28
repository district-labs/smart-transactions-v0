import type { DBIntentBatchActiveItem } from "@/db/queries/intent-batch"
import type { Hook, IntentBatchExecution } from "@district-labs/intentify-utils"
import { generateHooksForTimestamp } from "./intent-hooks/generate-hooks-for-timestamp"
import { splitSignature } from "./split-signature"

export function generateIntentBatchExecutionWithHooksFromIntentBatchQuery(
  intentBatch: DBIntentBatchActiveItem
): IntentBatchExecution {
  const signatureSplit = splitSignature(intentBatch.signature)
  const intentBatchExecution: IntentBatchExecution = {
    batch: {
      inntentBatchHash: intentBatch.intentBatchHash as `0x${string}`,
      root: intentBatch.root as `0x${string}`,
      nonce: intentBatch.nonce as `0x${string}`,
      intents: intentBatch.intents.map(intent => ({
        root: intent.root as `0x${string}`,
        target: intent.target as `0x${string}`,
        value: intent.value ? BigInt(intent.value) : BigInt(0),
        data: intent.data as `0x${string}`,
      })),
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
  intentBatch: DBIntentBatchActiveItem
): Hook[] {
  switch (intentBatch.strategyId) {
    // case "limit-order-basic
    case 1:
      return generateHooksForTimestamp(intentBatch.chainId)
      // return generateHooksForLimitOrderBasic(intentBatch.chainId)
    default:
      throw new Error(`No hooks for intentBatch ${intentBatch.intentBatchHash}`)
  }
}

