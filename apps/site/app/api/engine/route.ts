/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import type { DBIntentBatchActiveItem } from "@/db/queries/intent-batch"
import { selectIntentBatchActiveQuery } from "@/db/queries/intent-batch"
import { env } from "@/env.mjs"
import type { IntentBatchExecution } from "@district-labs/intentify-core"
import { BaseError, ContractFunctionRevertedError } from "viem"

import { convertIntentBigIntToNumber } from "./core/convert-intent-bigint-to-number"
import { generateIntentBatchExecutionWithHooksFromIntentBatchQuery } from "./core/generate-intent-batch-execution-with-hooks-from-intent-batch-query"
import { simulateIntentBatchExecution } from "./core/simulate-intent-bundles-execution"

async function calculateAndDispatch(chainId: number) {
  const intentBatchExecutionQuery = await selectIntentBatchActiveQuery.execute()
  if (intentBatchExecutionQuery.length === 0) return

  const intentBatchExecutionObjects = intentBatchExecutionQuery.map(
    (intentBatch: DBIntentBatchActiveItem) => {
      return generateIntentBatchExecutionWithHooksFromIntentBatchQuery(
        intentBatch
      )
    }
  )
  if (intentBatchExecutionObjects.length === 0) return

  // Find the executable intents.
  // We do this by simulating the execution of the intent batch on the
  // IntentifySafeModule contract. If the execution reverts, we know that the
  // intent is not executable.
  const executableIntentBatchBundle: IntentBatchExecution[] = []

  for (let index = 0; index < intentBatchExecutionObjects.length; index++) {
    const eib = await intentBatchExecutionObjects[index]
    try {
      if (eib) {
        await simulateIntentBatchExecution(chainId, eib)
        // If the execution did not revert, we know that the intent is executable.
        // We add it to the list of executable intents.
        executableIntentBatchBundle.push(eib)
      }
    } catch (err) {
      if (err instanceof BaseError) {
        console.log(err.cause)
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError
        )
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError?.data?.errorName ?? ""
          console.log(errorName)
        }
      }
    }
  }

  if (executableIntentBatchBundle.length === 0) return

  const res = await fetch(env.API_EXECUTE_INTENT_BATCHES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chainId: 31337,
      executableIntentBatchBundle: executableIntentBatchBundle.map(
        convertIntentBigIntToNumber
      ),
    }),
  })

  if (!res.ok) {
    console.error(res.statusText)
    return
  }
}

export async function GET(req: Request) {
  const res = new Response()
  // const { chainId } = await req.json()
  await calculateAndDispatch(31337)
  console.log("Hello from Intent Engine")
  return res
}
