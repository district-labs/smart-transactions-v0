/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { IntentBatchQuery } from "@/db/queries/intent-batch"
import { generateIntentBatchExecutionWithHooksFromIntentBatchQuery } from "./core/generate-intent-batch-execution-with-hooks-from-intent-batch-query"
import { selectAllIntentBatchQuery } from '@/db/queries/intent-batch' 
import { simulateIntentBatchExecution } from "./core/simulate-intent-bundles-execution"
import { BaseError, ContractFunctionRevertedError } from "viem"
import type { IntentBatchExecution } from "@district-labs/intentify-utils"

// import {
//   convertIntentBundleExecutionQueryToMulticall,
//   filterExecutableIntents,
//   simulateMultipleIntentBundleWithMulticall,
// } from "./core"

const API_URL_EXECUTE_INTENT_BUNDLES = "api/execute"

async function calculateAndDispatch(chainId: number) {
  const intentBatchExecutionQuery = await selectAllIntentBatchQuery()
  if(intentBatchExecutionQuery.length === 0) return;

  const intentBatchExecutionObjects = intentBatchExecutionQuery.map((intentBatch: IntentBatchQuery) => {
    generateIntentBatchExecutionWithHooksFromIntentBatchQuery(intentBatch)
  })
  if (intentBatchExecutionObjects.length === 0) return

  // Find the executable intents.
  // We do this by simulating the execution of the intent batch on the
  // IntentifySafeModule contract. If the execution reverts, we know that the
  // intent is not executable.
  const executableIntentBundles: IntentBatchExecution[] = [];

  for (let index = 0; index < intentBatchExecutionObjects.length; index++) {
    const eib = intentBatchExecutionObjects[index];
    try {
      await simulateIntentBatchExecution(chainId, eib)

      // If the execution did not revert, we know that the intent is executable.
      // We add it to the list of executable intents.
      executableIntentBundles.push(eib)
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError?.data?.errorName ?? ''
          // do something with `errorName`
        }
      }
    }
  }

  const res = await fetch(API_URL_EXECUTE_INTENT_BUNDLES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(executableIntentBundles),
  })

  if (!res.ok) {
    console.error(res.statusText)
    return
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(req: Request) {
  const res = new Response()
  // await calculateAndDispatch()

  console.log("Hello from Cron Job")
  return res
}
