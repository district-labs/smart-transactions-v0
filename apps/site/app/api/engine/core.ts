/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SelectAllIntentBatchQuery } from "@/db/queries/intent-batch"
import { Hook, intentifySafeModuleABI } from "@district-labs/intentify-utils"
import type { Abi } from "viem"

import { publicClients } from "@/app/api/engine/networks"

type IntentBundleExecutionParsed = {
  readonly address: `0x${string}`
  abi: Abi
  functionName: string
  args?: unknown[]
}

export function filterExecutableIntents(calls: any[]) {
  return calls.filter((call) => {
    return call.success
  })
}

export async function simulateMultipleIntentBundleWithMulticall(
  chainId: number,
  bundleBatch: IntentBundleExecutionParsed
) {
  const publicClient = publicClients[chainId]
  if (!publicClient) throw new Error(`No client for chainId ${chainId}`)

  return await publicClient.multicall({
    // @ts-ignore
    contracts: bundleBatch,
  })
}

export function convertIntentBundleExecutionQueryToMulticall(
  address: `0x{string}`,
  intentBatchQuery: SelectAllIntentBatchQuery[]
): IntentBundleExecutionParsed[] {
  return intentBatchQuery.map((intentBatch) => {
    intentBatch
    const IntentBatch = {
      root: intentBatch.root,
      nonce: intentBatch.nonce,
      intents: intentBatch.intents,
    }

    // Return object to be used in multicall and simulateTransaction
    return {
      address: address,
      abi: intentifySafeModuleABI,
      functionName: "execute",
      args: [
        {
          batch: IntentBatch,
          signature: intentBatch.signature,
          hooks: generateHooksForIntentBatch(intentBatch),
        },
      ],
    }
  })
}

function generateHooksForIntentBatch(
  intentBatch: SelectAllIntentBatchQuery
): Hook[] {
  // TODO: Make a better id system for intentBatches. This is just a placeholder.
  switch (intentBatch.id) {
    case 1:
      return generateHooksForLimitOrderBasic()
    default:
      throw new Error(`No hooks for intentBatch ${intentBatch.id}`)
  }
}

function generateHooksForLimitOrderBasic() {
  return [
    {
      target: "0x",
      data: "0x",
    },
  ]
}
