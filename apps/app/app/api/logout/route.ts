import { getIronSession } from "iron-session"

import { ironOptions } from "@/lib/session"

export async function GET(req: Request) {
  const res = new Response(JSON.stringify({ ok: true }))
  const session = await getIronSession(req, res, ironOptions)
  session.destroy()
  return res
}
