/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { SelectAllIntentBatchQuery } from "@/db/queries/intent-batch"
import { Hook, intentifySafeModuleABI } from "@district-labs/intentify-utils"
import type { Abi } from "viem"

type IntentBundleExecutionParsed = {
  readonly address: `0x${string}`
  abi: Abi
  functionName: string
  args?: unknown[]
}

function generateHooksForIntentBatch(
  intentBatch: SelectAllIntentBatchQuery
): Hook[] {
  // TODO: Match the intentId to the correct hooks
  switch (intentBatch.id) {
    case "0x00000000":
      return generateHooksForLimitOrderBasic(intentBatch.chainId)
    default:
      throw new Error(`No hooks for intentBatch ${intentBatch.id}`)
  }
}

function generateHooksForLimitOrderBasic() {
  // 1. Timestamp Intent == No Hook
  // 2. Token Release Intent == No Hook
  // 3. Limit Order Intent == Fill on Uniswap
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
