/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import type { DBIntentBatchActiveItem, DBIntentBatchActiveQuery } from "@/db/queries/intent-batch"
import { generateIntentBatchExecutionWithHooksFromIntentBatchQuery } from "./core/generate-intent-batch-execution-with-hooks-from-intent-batch-query"
import { selectActiveIntentBatchQuery } from '@/db/queries/intent-batch' 
import { simulateIntentBatchExecution } from "./core/simulate-intent-bundles-execution"
import { BaseError, ContractFunctionRevertedError } from "viem"
import type { IntentBatchExecution } from "@district-labs/intentify-utils"

const API_URL_EXECUTE_INTENT_BUNDLES = "http://localhost:3000/api/execute"

async function calculateAndDispatch(chainId: number) {
  const intentBatchExecutionQuery = await selectActiveIntentBatchQuery.execute()

  if(intentBatchExecutionQuery.length === 0) return;

  const intentBatchExecutionObjects = intentBatchExecutionQuery.map((intentBatch: DBIntentBatchActiveItem) => {
    return generateIntentBatchExecutionWithHooksFromIntentBatchQuery(intentBatch)
  })
  if (intentBatchExecutionObjects.length === 0) return

  // Find the executable intents.
  // We do this by simulating the execution of the intent batch on the
  // IntentifySafeModule contract. If the execution reverts, we know that the
  // intent is not executable.
  const executableIntentBatchBundle: IntentBatchExecution[] = [];

  for (let index = 0; index < intentBatchExecutionObjects.length; index++) {
    const eib = intentBatchExecutionObjects[index];
    try {
      if (eib) {
        await simulateIntentBatchExecution(chainId, eib)
        // If the execution did not revert, we know that the intent is executable.
        // We add it to the list of executable intents.
        executableIntentBatchBundle.push(eib)
      }
    } catch (err) {
      if (err instanceof BaseError) {
        console.log(err.details)
        const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError?.data?.errorName ?? ''
          console.log(errorName)
        }
      }
    }
  }

  if (executableIntentBatchBundle.length === 0) return

  const res = await fetch(API_URL_EXECUTE_INTENT_BUNDLES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chainId,
      executableIntentBatchBundle,
    }),
  })

  if (!res.ok) {
    console.error(res.statusText)
    return
  }
}

export async function GET(req: Request) {
  const res = new Response()
  await calculateAndDispatch(5)
  console.log("Hello from Intent Engine")
  return res
}
