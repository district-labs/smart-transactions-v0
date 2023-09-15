import { User } from "@/db/schema"
import { getIronSession } from "iron-session"

import { ironOptions } from "@/lib/session"
import { getUserAction } from "@/app/_actions/user"

export async function GET(req: Request) {
  const res = new Response()
  const session = await getIronSession(req, res, ironOptions)
  let user: User | null = null

  if (session.siwe?.address) {
    user = await getUserAction(session.siwe.address)
  }

  return new Response(JSON.stringify({ user: user }))
}
