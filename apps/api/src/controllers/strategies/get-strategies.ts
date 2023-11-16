import type { NextFunction, Request, Response } from "express";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

import { getStrategiesDb } from "@district-labs/intentify-database";
import { z } from "zod";

const expandFieldsGetStrategies = ["manager", "intentBatches"];

export const getStrategiesQuerySchema = z.object({
  intentBatchRoot: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
  expand: getExpandFieldsSchema(expandFieldsGetStrategies),
});

export async function getStrategies(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { expand, limit, offset, intentBatchRoot } =
      getStrategiesQuerySchema.parse(request.query);
    const expandFields = getExpandFields(expand);

    const strategies = await getStrategiesDb({
      expandFields,
      limit,
      offset,
      intentBatchRoot,
    });

    return response.status(200).json(strategies);
  } catch (error) {
    next(error);
  }
}
