import { dbDeleteAllIntentBatches } from "@/db/writes/intent-batch"

export async function GET(req: Request) {
  try {
    await dbDeleteAllIntentBatches()

    return new Response(JSON.stringify({ ok: true }))
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response("Error storing order", {
      status: 500,
    })
  }
}
