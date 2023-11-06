import { type DbUser } from "@district-labs/intentify-database";
import type { SiweMessage } from "siwe";
import { type IronSessionOptions } from "iron-session/edge";

declare module "iron-session" {
  interface IronSessionData {
    nonce: string;
    siwe: SiweMessage;
    user: DbUser;
    address: string;
  }
}

export const ironOptions: IronSessionOptions = {
  cookieName: `${process.env.AUTH_NAME} session`,
  password: process.env.AUTH_SECRET_KEY as string,
  cookieOptions: {
    sameSite:  process.env.NODE_ENV == "production" ? "none" : undefined,
    secure: process.env.NODE_ENV == "production",
  },
};
