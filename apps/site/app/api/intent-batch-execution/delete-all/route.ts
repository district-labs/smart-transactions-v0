import { dbDeleteAllDbIntentBatchExecutions } from "@/db/writes/intent-batch-execution"

export async function GET() {
  try {
    await dbDeleteAllDbIntentBatchExecutions()
    return new Response(JSON.stringify({ ok: true }))
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response("Error deleting all IntentBatches", {
      status: 500,
    })
  }
}
