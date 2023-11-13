import { getUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { isAddress } from "viem";
import { z } from "zod";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

const expandFieldsGetUser = ["strategies", "emailPreferences"];

export const getUserQuerySchema = z.object({
  expand: getExpandFieldsSchema(expandFieldsGetUser),
});

export type GetUserReturnType = {
  data: Awaited<ReturnType<typeof getUserDb>>;
};

export async function getUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const userAddress = request.params.address;
    const { expand } = getUserQuerySchema.parse(request.query);

    if (!userAddress || !isAddress(userAddress)) {
      return response.status(400).json({ error: "Invalid user address" });
    }

    const expandFields = getExpandFields(expand);

    const user = await getUserDb({ userAddress, expandFields });

    
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}
