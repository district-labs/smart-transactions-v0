import { IntentBatch } from "@/db/schema"

import {
  convertIntentBundleExecutionQueryToMulticall,
  filterExecutableIntents,
  simulateMultipleIntentBundleWithMulticall,
} from "./core"

const API_URL_EXECUTE_INTENT_BUNDLES = "https://api.intentify.io/api/execute"

async function calculateAndDispatch() {
  const INTENTIFY_SAFE_MODULE = "0x00" as `0x${string}`

  const intentBatchExecutionQuery: IntentBatch = []
  const executableIntentBundles = filterExecutableIntents(
    await simulateMultipleIntentBundleWithMulticall(
      1,
      convertIntentBundleExecutionQueryToMulticall(
        INTENTIFY_SAFE_MODULE,
        intentBatchExecutionQuery
      )
    )
  )

  if (executableIntentBundles.length === 0) return

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
