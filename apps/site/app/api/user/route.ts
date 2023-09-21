import { type NextRequest } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getIronSession } from "iron-session"

import { ironOptions } from "@/lib/session"

export async function GET(req: NextRequest) {
  const res = new Response()
  const session = await getIronSession(req, res, ironOptions)

  return new Response(JSON.stringify({ user: session.user }))
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    await db.update(users).set(data).where(eq(users.address, data.address))
    // TODO add upsert

    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return new Response("Erorr updating user", { status: 500 })
  }
}
