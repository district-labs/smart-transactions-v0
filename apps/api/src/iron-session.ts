import { type DbUser } from "@district-labs/intentify-database";
import type { Request, Response } from "express";
import { getIronSession, type IronSessionOptions } from "iron-session";
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

const ironOptions: IronSessionOptions = {
  cookieName: `${env.AUTH_NAME} session`,
  password: env.AUTH_SECRET_KEY,
  cookieOptions: {
    sameSite: process.env.NODE_ENV == "production" ? "none" : undefined,
    secure: process.env.NODE_ENV == "production" ? true : undefined,
  },
};

export async function getSession(request: Request, response: Response) {
  return await getIronSession(request, response, ironOptions);
}
