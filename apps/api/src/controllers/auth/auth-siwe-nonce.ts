import { Request, Response, NextFunction } from "express";
import { getIronSession } from "iron-session"
import { generateNonce } from "siwe"
import { ironOptions } from "../../iron-session";

export const authSiweNonce = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const nonce = generateNonce()
    const session = await getIronSession(request, response, ironOptions)
    session.destroy()
    session.nonce = nonce
    await session.save()
    return response.status(200).send(nonce)
  } catch (error) {
    next(error);
  }
};