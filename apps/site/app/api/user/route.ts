import { type NextRequest } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getIronSession } from "iron-session"

import { ironOptions } from "@/lib/session"

export async function GET(req: NextRequest) {
  const res = new Response()
  const session = await getIronSession(req, res, ironOptions)
  return new Response(JSON.stringify({ address: session.address, isLoggedIn: !!session.address }))
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, data.address),
    })

    if (existingUser) {
      await db.update(users).set(data).where(eq(users.address, data.address))
    } else {
      await db.insert(users).values(data)
    }

    return new Response(JSON.stringify({ ok: true, user: 'hello' }))
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return new Response("Erorr updating user", { status: 500 })
  }
}
