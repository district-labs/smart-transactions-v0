import { getUserDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { getIronSession } from "iron-session";
import { z } from "zod";
import { ironOptions } from "../../iron-session";
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

    const session = await getIronSession(request, response, ironOptions);
    if (!session.address) {
      return response.status(404).json({ error: "No user found" });
    }

    const expandFields = getExpandFields(expand);
    const user = await getUserDb({
      userAddress: session.address,
      expandFields,
    });

    return response.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
