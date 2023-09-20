import { getIronSession } from "iron-session"

import { ironOptions } from "@/lib/session"

export async function GET(req: Request) {
  const res = new Response()
  const session = await getIronSession(req, res, ironOptions)

  return new Response(JSON.stringify({ user: session.user }))
}
