import { getUsersDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

const expandFieldsGetUsers = ["strategies", "emailPreferences"];
export const getUsersQuerySchema = z.object({
  limit: z.string().optional(),
  offset: z.string().optional(),
  expand: getExpandFieldsSchema(expandFieldsGetUsers),
});

export type GetUsersReturnType = {
  data: Awaited<ReturnType<typeof getUsersDb>>;
};

export async function getUsers(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { expand, limit, offset } = getUsersQuerySchema.parse(request.query);

    const expandFields = getExpandFields(expand);

    const users = await getUsersDb({ limit, offset, expandFields });

    return response.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
