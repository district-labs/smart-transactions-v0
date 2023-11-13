import { deleteUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { isAddress } from "viem";

export async function deleteUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const userAddress = request.params.address;

    if (!userAddress || !isAddress(userAddress)) {
      return response.status(400).json({ error: "Invalid user address" });
    }

    const { success, error, data } = await deleteUserDb({ userAddress });

    if (!success) {
      return response.status(500).json({ error: error });
    }

    return response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
