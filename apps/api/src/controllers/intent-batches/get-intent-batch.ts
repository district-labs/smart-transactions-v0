import { getIntentBatchDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

const expandFieldsGetIntentBatch = [
  "intents",
  "executedTxs",
  "user",
  "strategy",
];
export const getIntentBatchQuerySchema = z.object({
  expand: getExpandFieldsSchema(expandFieldsGetIntentBatch),
});

export async function getIntentBatch(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const intentBatchHash = request.params.id;

    if (!intentBatchHash) {
      return response.status(400).json({ error: "Invalid intent batch ID" });
    }
    const { expand } = getIntentBatchQuerySchema.parse(request.query);

    const expandFields = getExpandFields(expand);

    const intentBatch = await getIntentBatchDb({
      intentBatchHash,
      expandFields,
    });

    if (!intentBatch) {
      return response.status(404).json({ error: "Intent batch not found" });
    }

    return response.status(200).json({ data: intentBatch });
  } catch (error) {
    next(error);
  }
}
