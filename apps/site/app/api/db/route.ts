import { db } from "@/db"

// import { ironOptions } from "@/lib/session"
// import { getIronSession } from "iron-session"

// TODO: REMOVE THIS

export async function GET(req: Request) {
  try {
    // const res = new Response(JSON.stringify({ ok: true }))
    // TODO: Authenticate user before submitting intent
    // const session = await getIronSession(req, res, ironOptions)

    const results = await db.query.intentBatchExecution.findFirst({
      with: {
        hooks: true,
        intentBatch: {
          with: {
            intents: true,
          },
        },
      },
    })

    // console.log(JSON.stringify(results, null, 2))

    return new Response(JSON.stringify(results, null, 2))
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response(JSON.stringify({ ok: false }))
  }
}
