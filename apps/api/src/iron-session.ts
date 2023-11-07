import { type DbUser } from "@district-labs/intentify-database";
import { type IronSessionOptions } from "iron-session/edge";
import type { SiweMessage } from "siwe";
import { env } from "./env";

declare module "iron-session" {
  interface IronSessionData {
    nonce: string;
    siwe: SiweMessage;
    user: DbUser;
    address: string;
  }
}

export const ironOptions: IronSessionOptions = {
  cookieName: `${env.AUTH_NAME} session`,
  password: env.AUTH_SECRET_KEY,
  cookieOptions: {
    sameSite:  process.env.NODE_ENV == "production" ? "none" : undefined,
    secure: process.env.NODE_ENV == "production",
  },
};
