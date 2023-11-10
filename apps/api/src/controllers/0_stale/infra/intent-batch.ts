import type { NextFunction, Request, Response } from "express";
import { invalidateIntentInDB } from "../../../models/intent";
import { getIntentBatchesFromDB } from "../../../models/intent-batch";
import { IntentBatchValidationStruct } from "../../../types";
import { transformIntentBatchQueryToStruct } from "../../../utils/transform-intent-batch-query-to-struct";
import { intentBatchFactoryForValidation } from "./intent-batch-factory-for-validation";
import { invalidateIntentBatch } from "./utils";

export const invalidateIntentBatches = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const intentBatches = await getIntentBatchesFromDB({
      intentBatchesValidity: "valid",
    });

    const intentBatchStructs = intentBatches.map(
      transformIntentBatchQueryToStruct,
    );
    const validations = await Promise.all(
      intentBatchStructs.map(
        async (intentBatch: any): Promise<IntentBatchValidationStruct> => {
          const validationResults =
            await intentBatchFactoryForValidation.validate(
              intentBatch.raw,
              intentBatch.chainId,
            );
          return {
            original: intentBatch.original,
            raw: intentBatch.raw,
            invalidations: validationResults,
          };
        },
      ),
    );
    const intentInvalidations = validations.flatMap((value) =>
      invalidateIntentBatch(value),
    );
    intentInvalidations.forEach(async (invalidation: any) => {
      await invalidateIntentInDB(invalidation.intent.intentId);
    });

    return response.status(200).json({
      data: intentInvalidations,
    });
  } catch (error) {
    next(error);
  }
};
