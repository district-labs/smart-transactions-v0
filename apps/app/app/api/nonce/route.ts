import { getIronSession } from "iron-session"
import { generateNonce } from "siwe"

import { ironOptions } from "@/lib/session"

export async function GET(req: Request) {
  const nonce = generateNonce()
  const res = new Response(nonce, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
  const session = await getIronSession(req, res, ironOptions)
  session.destroy()
  session.nonce = nonce
  await session.save()

  return res
}
