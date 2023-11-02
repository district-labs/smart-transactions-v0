import { NextFunction, Request, Response } from "express";
import {
  getIntentBatchFromDB,
  getIntentBatchesFromDB,
} from "../../models/intent-batch";
import CustomError from "../../utils/customError";

/**
 * Handle request to retrieve all users.
 * Filters can be optionally applied to narrow down the result set.
 */
export const getIntentBatches = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const filters = request.query;
    const intentBatches = await getIntentBatchesFromDB(filters);

    return response.status(200).json({ data: intentBatches });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to retrieve a user by their ID.
 */
export const getIntentBatchById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const intentBatchId = request.params.id;
    if (!intentBatchId) {
      throw new CustomError("Invalid IntentBatch ID", 400);
    }

    const intentBatch = await getIntentBatchFromDB(intentBatchId);

    return response.status(200).json({ data: intentBatch });
  } catch (error) {
    next(error);
  }
};
