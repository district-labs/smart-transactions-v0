import type { IntentBatchExecution } from "@district-labs/intentify-core"
import type { DbIntentBatchWithRelations } from "@district-labs/intentify-database"
import type { PublicClient } from "viem"

import { generateIntentHook } from "./generate-intent-hook"
import { splitSignature } from "./split-signature"

interface GenerateIntentBatchExecutionParams {
  intentBatch: DbIntentBatchWithRelations
  publicClient: PublicClient
}

export async function generateIntentBatchExecution({
  intentBatch,
  publicClient,
}: GenerateIntentBatchExecutionParams) {
  const signatureSplit = splitSignature(intentBatch.signature)

  if (!intentBatch?.intents || intentBatch?.intents.length === 0) {
    throw new Error("No intents found in intent batch")
  }

  const { chainId } = intentBatch

  const intentBatchExecution: IntentBatchExecution = {
    batch: {
      root: intentBatch.root as `0x${string}`,
      nonce: intentBatch.nonce as `0x${string}`,
      intents: intentBatch.intents.map((intent: any) => ({
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
    hooks: await Promise.all(
      intentBatch.intents.map((intent) =>
        generateIntentHook({
          chainId,
          intent,
          publicClient,
        })
      )
    ),
  }

  return intentBatchExecution
}
