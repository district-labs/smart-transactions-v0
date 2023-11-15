import { putUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { isAddress } from "viem";
import { z } from "zod";
import { getSession } from "../../iron-session";

export const putUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  isRegistered: z.boolean().optional(),
  safeAddress: z
    .string()
    .refine((value) => isAddress(value))
    .optional(),
});

export type PutUserApiParams = z.infer<typeof putUserSchema>;

export async function putUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const session = await getSession(request, response);

  if (!session?.address) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const updatedUserData = putUserSchema.parse(request.body);

  const { ok, error } = await putUserDb({
    ...updatedUserData,
    address: session.address,
  });

  if (!ok) {
    return response.status(500).json({ error: error });
  }

  return response.status(200).json({ ok });
}
