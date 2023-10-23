import { db } from "@/db"
import { users } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"
import { getIronSession } from "iron-session"
import { SiweMessage } from "siwe"
import { z } from "zod"

import { ironOptions } from "@/lib/session"

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
    session.address = fields.address

    if (env.DATABASE_URL) {
      const user = await db.query.users.findFirst({
        where: eq(users.address, fields.address),
      })

      if (user) {
        session.user = user
      } else {
        await db.insert(users).values({
          address: fields.address,
        })
        session.address = fields.address
      }
    }

    console.log("saving session")

    await session.save()
    return res
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error(errorMessage)
    return new Response(JSON.stringify({ ok: false }))
  }
}
