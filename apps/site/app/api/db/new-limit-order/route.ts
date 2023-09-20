import { db } from "@/db"
import {
  hooks as hooksDb,
  intentBatch as intentBatchDb,
  intentBatchExecution as intentBatchExecutionDb,
  intents as intentsDb,
} from "@/db/schema"
// import { getIronSession } from "iron-session"
// import { verifyTypedData, type Address } from "viem"
import { z } from "zod"

// import { ironOptions } from "@/lib/session"

const verifySchema = z.object({
  intentBatchEIP712: z.any(),
  intentBatchExecution: z.object({
    chainId: z.number(),
    signature: z.string(),
    hooks: z.array(
      z.object({
        target: z.string(),
        data: z.string().nullable(),
      })
    ),
    intentBatch: z.object({
      nonce: z.string(),
      root: z.string(),
      intents: z.array(
        z.object({
          name: z.string(),
          version: z.string(),
          root: z.string(),
          target: z.string(),
          value: z.string(),
          data: z.string().nullable(),
          intentArgs: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
              value: z.union([z.string(), z.number()]),
            })
          ),
        })
      ),
    }),
  }),
})

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

    const body = verifySchema.parse(await req.json())
    const { intentBatchExecution, intentBatchEIP712 } = body
    const { chainId, signature, intentBatch, hooks } = intentBatchExecution

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
      const intentBatchExecutionResult = await tx
        .insert(intentBatchExecutionDb)
        .values({
          chainId,
          signature,
        })
      const intentBatchExecutionId = Number(intentBatchExecutionResult.insertId)

      const intentBatchResult = await tx.insert(intentBatchDb).values({
        // TODO: Update nonce
        nonce: intentBatch.nonce,
        root: intentBatch.root,
        intentBatchExecutionId,
      })

      const intentBatchId = Number(intentBatchResult.insertId)

      await tx.insert(intentsDb).values(
        intentBatch.intents.map((intent) => ({
          name: intent.name,
          version: intent.version,
          intentArgs: intent.intentArgs,
          root: intent.root,
          target: intent.target,
          data: intent.data,
          intentBatchId,
        }))
      )

      await tx.insert(hooksDb).values(
        hooks.map((hook) => ({
          target: hook.target,
          data: hook.data,
          intentBatchExecutionId,
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
