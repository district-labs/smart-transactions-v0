import { NextFunction, Request, Response } from "express";
import {
  getIntentBatchesFromDB
} from "../../models/intent-batch";
import { transformIntentBatchQueryToStruct } from "../../utils/transform-intent-batch-query-to-struct";
import { invalidateIntentInDB } from "../../models/intent";
import { IntentBatchValidationStruct, invalidateIntentBatch } from "./utils";
import { intentBatchFactoryForValidation } from "./intent-batch-factory-for-validation";


export const invalidateIntentBatches = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const intentBatches = await getIntentBatchesFromDB({
      intentBatchesValidity: "valid",
    });

    const intentBatchStructs = intentBatches.map(transformIntentBatchQueryToStruct)
    const validations = await Promise.all(intentBatchStructs.map(async (intentBatch: any): Promise<IntentBatchValidationStruct> => {
      const validationResults = await intentBatchFactoryForValidation.validate(intentBatch.raw, intentBatch.chainId)
      return {
        original: intentBatch.original,
        raw: intentBatch.raw,
        invalidations: validationResults
      }
    }))
    
    const intentInvalidations = validations.map((value) => invalidateIntentBatch(value)).flat()
    console.log(intentInvalidations)
    intentInvalidations.forEach(async (invalidation: any) => {
      await invalidateIntentInDB(invalidation.intent.intentId)
    })

    return response.status(200).json({
      data: intentInvalidations
    });
  } catch (error) {
    next(error);
  }
};
