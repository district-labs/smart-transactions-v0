import { type NextRequest } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address")
    const user = await db.query.users.findFirst({
      columns: {
        address: true,
        firstName: true,
      },
      where: eq(users.address, address as string),
    })

    if (!user) {
      throw new Error("Could not find user.")
    }

    return new Response(JSON.stringify(user))
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return new Response("Erorr updating user", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    await db.update(users).set(data).where(eq(users.address, data.address))

    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return new Response("Erorr updating user", { status: 500 })
  }
}
