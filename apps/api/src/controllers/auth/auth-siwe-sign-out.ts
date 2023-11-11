import { Request, Response, NextFunction } from "express";
import { getIronSession } from "iron-session";
import { SiweMessage } from "siwe";
import { db, eq, users } from "@district-labs/intentify-database";
import { ironOptions } from "../../iron-session";
import { z } from "zod";

const verifySchema = z.object({
  signature: z.string(),
  message: z.object({
    domain: z.string(),
    address: z.string(),
    statement: z.string(),
    uri: z.string(),
    version: z.string(),
    chainId: z.number(),
    nonce: z.string(),
    issuedAt: z.string(),
  }),
});

export const authSiweSignOut = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    console.log(session, "sessionsession");
    session.destroy();
    return response.status(200).json({ oke: true });
  } catch (error) {
    next(error);
  }
};
