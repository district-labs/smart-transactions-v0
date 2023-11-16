import { postUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { isAddress } from "viem";
import { z } from "zod";
import { getSession } from "../../iron-session";

export const postUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  safeAddress: z
    .string()
    .refine((value) => isAddress(value))
    .optional(),
  emailPreferences: z
    .object({
      newsletter: z.boolean().nullable().optional(),
      marketing: z.boolean().nullable().optional(),
      transactional: z.boolean().nullable().optional(),
    })
    .optional(),
});

export type PostUserApiParams = z.infer<typeof postUserSchema>;

export async function postUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const newUserData = postUserSchema.parse(request.body);
  const session = await getSession(request, response);

  if (!session?.address) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const { ok, error } = await postUserDb({
    newUserData: {
      ...newUserData,
      address: session.address,
    },
    emailPreferencesData: {
      ...newUserData.emailPreferences,
      userId: session.address,
    },
  });

  if (!ok) {
    return response.status(500).json({ error: error });
  }

  return response.status(201).json({ ok });
}
