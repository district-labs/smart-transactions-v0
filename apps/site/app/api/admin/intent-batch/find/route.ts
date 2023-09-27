import { db } from "@/db"

export async function GET() {
  try {
    const results = await db.query.intentBatch.findMany({
      with: {
        intents: true,
        intentBatchExecution: {
          with: {
            hooks: true,
          },
        },
        strategy: {
          with: {
            manager: true,
          },
        },
      },
    })
    return new Response(JSON.stringify(results, null, 2))
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response(JSON.stringify({ ok: false }))
  }
}
