import { getUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getSession } from "../../iron-session";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

const expandFieldsGetUser = ["strategies", "emailPreferences"];

export const getAuthUserQuerySchema = z.object({
  expand: getExpandFieldsSchema(expandFieldsGetUser),
});

export const getAuthUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { expand } = getAuthUserQuerySchema.parse(request.query);

    const session = await getSession(request, response);
    if (!session.address) {
      return response.status(404).json({ error: "No user found" });
    }

    const expandFields = getExpandFields(expand);
    const user = await getUserDb({
      userAddress: session.address,
      expandFields,
    });

    if (!user) {
      return response.status(404).json({ ok: false, error: "User not found" });
    }

    return response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
