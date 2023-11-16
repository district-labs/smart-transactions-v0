import { putEmailPreferencesDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getSession } from "../../iron-session";

export const putEmailPreferencesSchema = z.object({
  newsletter: z.boolean().nullable().optional(),
  marketing: z.boolean().nullable().optional(),
  transactional: z.boolean().nullable().optional(),
});

export type PutEmailPreferencesApiParams = z.infer<
  typeof putEmailPreferencesSchema
>;

export async function putEmailPreferences(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const session = await getSession(request, response);

  if (!session?.address) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const updatedEmailPreferencesData = putEmailPreferencesSchema.parse(
    request.body,
  );

  const putEmailPreferencesResponse = await putEmailPreferencesDb({
    ...updatedEmailPreferencesData,
    userId: session.address,
  });

  if (!putEmailPreferencesResponse.ok) {
    return response.status(500).json(putEmailPreferencesResponse);
  }

  return response.status(200).json(putEmailPreferencesResponse);
}
