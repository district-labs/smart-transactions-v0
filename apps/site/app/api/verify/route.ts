import { db } from "@/db"
import { users } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"
import { getIronSession } from "iron-session"
import { SiweMessage } from "siwe"
import { z } from "zod"

import { ironOptions } from "@/lib/session"
import { getUserAction } from "@/app/_actions/user"

const verifySchema = z.object({
  signature: z.string(),
  message: z.object({
    domain: z.string(),
    address: z.string(),
    statement: z.string(),
    uri: z.string(),
    version: z.string(),
    chainId: z.number(),
    nonce: z.string(),
    issuedAt: z.string(),
  }),
})

export async function POST(req: Request) {
  try {
    const res = new Response(JSON.stringify({ ok: true }))
    const session = await getIronSession(req, res, ironOptions)
    const { message, signature } = verifySchema.parse(await req.json())
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)
    if (fields.nonce !== session.nonce)
      return new Response(JSON.stringify({ message: "Invalid nonce." }), {
        status: 422,
      })

    session.siwe = fields
    await session.save()

    if (env.DATABASE_URL) {
      const user = await getUserAction(fields.address)
      if (!user) {
        await db.insert(users).values({
          address: fields.address,
        })
      } else {
        session.user = user
        await session.save()
      }
    }

    return res
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response(JSON.stringify({ ok: false }))
  }
}
