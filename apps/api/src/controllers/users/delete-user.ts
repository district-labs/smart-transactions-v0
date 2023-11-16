import { deleteUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { isAddress } from "viem";
import { getSession } from "../../iron-session";

export async function deleteUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const userAddress = request.params.address;
    const session = await getSession(request, response);

    if (!isAddress(userAddress)) {
      return response.status(400).json({ error: "Invalid user address" });
    }

    if (session?.address !== userAddress) {
      return response.status(401).json({ error: "Unauthorized" });
    }
    const { ok, error } = await deleteUserDb({ userAddress });

    if (!ok) {
      return response.status(500).json({ error: error });
    }

    return response.status(200).json({ ok });
  } catch (error) {
    next(error);
  }
}
