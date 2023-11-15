import { getIntentBatchesDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

const expandFieldsGetIntentBatches = [
  "intents",
  "executedTxs",
  "user",
  "strategy",
];

export const getIntentBatchesQuerySchema = z.object({
  limit: z.string().optional(),
  offset: z.string().optional(),
  root: z.string().optional(),
  strategyId: z.string().optional(),
  expand: getExpandFieldsSchema(expandFieldsGetIntentBatches),
});

export async function getIntentBatches(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { expand, root, strategyId, limit, offset } =
      getIntentBatchesQuerySchema.parse(request.query);

    const expandFields = getExpandFields(expand);

    const intentBatches = await getIntentBatchesDb({
      limit,
      offset,
      expandFields,
      root,
      strategyId,
    });

    return response.status(200).json({ data: intentBatches });
  } catch (error) {
    next(error);
  }
}
