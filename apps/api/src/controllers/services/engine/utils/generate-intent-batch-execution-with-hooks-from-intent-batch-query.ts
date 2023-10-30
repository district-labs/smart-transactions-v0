
import type { Hook, IntentBatchExecution } from "@district-labs/intentify-core"

import { generateHooksForLimitOrderBasic } from "./intent-hooks/generate-hooks-for-limit-order-basic"
import { splitSignature } from "./split-signature"
import { DBIntentBatchActiveItem } from "../../../../database/queries/intent-batch"
import { getTokenDecimals } from "./token-decimals"

interface LimitOrderIntentArgs {
  tokenOut: `0x${string}`
  tokenIn: `0x${string}`
  amountOutMax: string
  amountInMin: string
}

// convert the list to an object with name as keys and value as values
function limitOrderArgsToObj(
  args: {
    name: string
    type: string
    value: string | number
  }[]
) {
  const obj: Record<string, string | number> = {}

  for (const item of args) {
    obj[item.name] = item.value
  }

  return obj as unknown as LimitOrderIntentArgs
}

export async function generateIntentBatchExecutionWithHooksFromIntentBatchQuery(
  intentBatch: DBIntentBatchActiveItem
): Promise<IntentBatchExecution> {
  const signatureSplit = splitSignature(intentBatch.signature)
  const intentBatchExecution: IntentBatchExecution = {
    batch: {
      intentBatchHash: intentBatch.intentBatchHash as `0x${string}`,
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
    hooks: await generateHooksForIntentBatch(intentBatch),
  }

  return intentBatchExecution
}

async function generateHooksForIntentBatch(
  intentBatch: DBIntentBatchActiveItem
): Promise<Hook[]> {
  switch (intentBatch.strategyId) {
    // case "limit-order-basic
    case "1": {
      const limitOrderIntent = intentBatch.intents[2]
      const intentArgs = limitOrderArgsToObj(limitOrderIntent.intentArgs)
      return await generateHooksForLimitOrderBasic({
        chainId: intentBatch.chainId,
        amountOut: intentArgs.amountInMin as `0x${string}`,
        recipient: intentBatch.root as `0x${string}`,
        amountInMax: intentArgs.amountOutMax,
        inputToken: {
          address: intentArgs.tokenIn,
          decimals: await getTokenDecimals({ // TODO: Use token list to get decimals
            chainId: intentBatch.chainId,
            tokenAddress: intentArgs.tokenIn,
          }),
        },
        outputToken: {
          address: intentArgs.tokenOut,
          decimals: await getTokenDecimals({ // TODO: Use token list to get decimals
            chainId: intentBatch.chainId,
            tokenAddress: intentArgs.tokenOut,
          }),
        },
      })
    }
    default:
      throw new Error(`No hooks for intentBatch ${intentBatch.intentBatchHash}`)
  }
}
