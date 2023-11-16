import { getStrategyDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

const expandFieldsGetStrategy = ["manager", "intentBatches"];

export const getStrategyQuerySchema = z.object({
  expand: getExpandFieldsSchema(expandFieldsGetStrategy),
});

export async function getStrategy(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const strategyId = request.params.id;
    const { expand } = getStrategyQuerySchema.parse(request.query);

    if (!strategyId) {
      return response.status(400).json({ error: "Invalid strategy id" });
    }

    const expandFields = getExpandFields(expand);

    const strategy = await getStrategyDb({ strategyId, expandFields });

    if (!strategy) {
      return response.status(404).json({ error: "Strategy not found" });
    }

    return response.status(200).json(strategy);
  } catch (error) {
    next(error);
  }
}
