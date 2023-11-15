import type { NextFunction, Request, Response } from "express";
import { generateNonce } from "siwe";
import { getSession } from "../../iron-session";

export const getAuthNonce = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const nonce = generateNonce();
    const session = await getSession(request, response);
    session.destroy();
    session.nonce = nonce;

    await session.save();
    return response.status(200).send(nonce);
  } catch (error) {
    next(error);
  }
};
