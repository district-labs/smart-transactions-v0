import { db } from "@/db"
import { intentBatch as intentBatchDb, intents as intentsDb } from "@/db/schema"

// import { getIronSession } from "iron-session"
// import { verifyTypedData, type Address } from "viem"
import { newLimitOrderSchema } from "@/lib/validations/limit-order"

// import { ironOptions } from "@/lib/session"

export async function POST(req: Request) {
  try {
    // const res = new Response(JSON.stringify({ ok: true }))
    // const session = await getIronSession(req, res, ironOptions)

    // if (!session?.address) {
    //   return new Response(
    //     "User not authenticated",
    //     {status: 401}
    //   )
    // }

    const body = newLimitOrderSchema.parse(await req.json())
    const { intentBatch } = body
    const { chainId, intents, nonce, root, signature, intentBatchHash } = intentBatch

    // const verification = await verifyTypedData({
    //   address: session.address as Address,
    //   domain: intentBatchEIP712.domain,
    //   message: intentBatchEIP712.message,
    //   primaryType: intentBatchEIP712.primaryType,
    //   signature: intentBatchExecution.signature as Address,
    //   types: intentBatchEIP712.types,
    // })

    // if (!verification) {
    //   return new Response(
    //    "Invalid signature",
    //    {status: 401}
    //   )
    // }

    await db.transaction(async (tx) => {
      const intentBatchResult = await tx.insert(intentBatchDb).values({
        intentBatchHash,
        nonce,
        chainId,
        root,
        signature,
        // Hardcoding strategyId for now
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
