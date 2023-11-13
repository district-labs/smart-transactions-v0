import {
  db,
  emailPreferences,
  eq,
  users,
} from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { getIronSession } from "iron-session";
import { SiweMessage } from "siwe";
import { z } from "zod";
import { ironOptions } from "../../iron-session";

export const getAuthSessionSchema = z.object({
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

export async function postAuthSession(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const session = await getIronSession(request, response, ironOptions);
    const { message, signature } = getAuthSessionSchema.parse(
      await request.body,
    );
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);

    if (fields.nonce !== session.nonce) {
      return response
        .status(422)
        .json(JSON.stringify({ message: "Invalid nonce." }));
    }

    session.siwe = fields;
    session.address = fields.address;

    const user = await db.query.users.findFirst({
      where: eq(users.address, fields.address),
    });

    if (user) {
      session.user = user;
    } else {
      session.address = fields.address;
      await db.insert(users).values({
        address: fields.address,
      });

      await db.insert(emailPreferences).values({
        marketing: true,
        newsletter: true,
        transactional: true,
        userId: session.address,
      });
    }

    await session.save();
    return response.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export async function deleteAuthSession(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const session = await getIronSession(request, response, ironOptions);
    session.destroy();
    return response.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
}
