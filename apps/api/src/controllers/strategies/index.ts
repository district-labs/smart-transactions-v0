import { db, eq, strategies } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";

import { z } from "zod";

const expandFieldsGetStrategies = ["manager", "intentBatches"];
const getStrategiesQuerySchema = z.object({
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
    const { expand, limit, offset } = getStrategiesQuerySchema.parse(
      request.query,
    );
    const expandFields = getExpandFields(expand);

    const strategies = await db.query.strategies.findMany({
      limit: Number(limit),
      offset: Number(offset),
      with: {
        manager: expandFields.includes("manager") ? true : undefined,
        intentBatches: expandFields.includes("intentBatches")
          ? true
          : undefined,
      },
    });
    return response.status(200).json({ data: strategies });
  } catch (error) {
    next(error);
  }
}

const getStrategyQuerySchema = z.object({
  expand: getExpandFieldsSchema(expandFieldsGetStrategies),
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

    const strategy = await db.query.strategies.findFirst({
      where: eq(strategies.id, strategyId),
      with: {
        manager: expandFields.includes("manager") ? true : undefined,
        intentBatches: expandFields.includes("intentBatches")
          ? true
          : undefined,
      },
    });

    if (!strategy) {
      return response.status(404).json({ error: "Strategy not found" });
    }

    return response.status(200).json({ data: strategy });
  } catch (error) {
    next(error);
  }
}
