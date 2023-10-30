import { type User } from "@district-labs/intentify-database"
import type { SiweMessage } from "siwe"
import {
    type IronSessionOptions,
} from "iron-session/edge"

declare module "iron-session" {
    interface IronSessionData {
      nonce: string
      siwe: SiweMessage
      user: User
      address: string
    }
  }

export const ironOptions: IronSessionOptions = {
  cookieName: `${process.env.AUTH_NAME} session`,
  password: process.env.AUTH_SECRET_KEY as string,
  cookieOptions: {
    sameSite: "none",
    secure: process.env.NODE_ENV == "production",
  },
}