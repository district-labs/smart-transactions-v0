import { db } from "@/db"
import { intentBatch as intentBatchDb, intents as intentsDb } from "@/db/schema"
import { ApiIntentBatch } from "@/lib/validations/api/intent-batch"

export async function POST(req: Request) {
  try {
    const body = ApiIntentBatch.parse(await req.json())
    const { intentBatch } = body
    const { chainId, intents, nonce, root, signature } = intentBatch

    await db.transaction(async (tx) => {
      const intentBatchResult = await tx.insert(intentBatchDb).values({
        intentBatchHash: intentBatch.intentBatchHash,
        nonce,
        chainId: Number(chainId),
        root,
        signature,
        // TODO: Make this dynamic
        strategyId: 1,
      })

      const intentBatchId = Number(intentBatchResult.insertId)

      await tx.insert(intentsDb).values(
        intents.map((intent) => ({
          intentId: intent.intentId,
          intentArgs: intent.intentArgs,
          root: intent.root,
          target: intent.target,
          data: intent.data,
          intentBatchId,
        }))
      )
    })

    return new Response(JSON.stringify({ ok: true }))
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response("Error storing order", {
      status: 500,
    })
  }
}
