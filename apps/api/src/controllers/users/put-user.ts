import { putUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { isAddress } from "viem";
import { z } from "zod";

export const putUserSchema = z.object({
  address: z.string().refine((value) => isAddress(value)),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  emailPreferences: z
    .object({
      newsletter: z.boolean().nullable().optional(),
      marketing: z.boolean().nullable().optional(),
      transactional: z.boolean().nullable().optional(),
    })
    .optional(),
});

export async function putUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const updatedUserData = putUserSchema.parse(request.body);

  const { success, error, data } = await putUserDb({
    updatedUserData: {
      address: updatedUserData.address,
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName,
      emailPreferences: {
        ...updatedUserData.emailPreferences,
        userId: updatedUserData.address,
      },
    },
  });

  if (!success) {
    return response.status(500).json({ error: error });
  }

  return response.status(200).json({ data });
}
