import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { User } from "@/db/schema"
import { env } from "@/env.mjs"
import {
  unsealData,
  type IronSessionData,
  type IronSessionOptions,
} from "iron-session"
import type { SiweMessage } from "siwe"

import { siteConfig } from "@/config/site"

declare module "iron-session" {
  interface IronSessionData {
    nonce: string
    siwe: SiweMessage
    user: User
    address: string
  }
}

// The httpOnly cookie option is not working so we are using
// a hack to remove the cookie from the browser
// See: /api/siwe/logout
export const ironOptions: IronSessionOptions = {
  cookieName: `${siteConfig.name} web3session`,
  password: env.AUTH_SECRET_KEY,
  cookieOptions: {
    secure: process.env.NODE_ENV == "production",
  },
}

export async function getRequestCookie(cookies: ReadonlyRequestCookies) {
  const cookieName = `${siteConfig.name} web3session`
  const found = cookies.get(cookieName)

  if (!found) return null

  const user = await unsealData<IronSessionData>(found.value, {
    password: env.AUTH_SECRET_KEY,
  })

  return user
}
