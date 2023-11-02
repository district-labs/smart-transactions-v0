import { NextFunction, Request, Response } from "express";
import {
  getIntentBatchesFromDB
} from "../../models/intent-batch";
import { transformIntentBatchQueryToStruct } from "../../utils/transform-intent-batch-query-to-struct";
import { intentBatchFactory } from "../../intent-batch-factory";
import { invalidateIntentInDB } from "../../models/intent";
import { IntentBatchValidationStruct, invalidateIntentBatch } from "./utils";


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
    const validations = intentBatchStructs.map(async (intentBatch: any, idx: number): Promise<IntentBatchValidationStruct> => {
      const validationResults = await intentBatchFactory.validate(intentBatch.raw, intentBatch.chainId, [
        {
          name: "Erc20LimitOrder",
          args: {
            root: intentBatch.original.root
          }
        },
        {
          name: "AaveLeverageLong",
          args: {
            root: intentBatch.original.root
          }
        },
        {
          name: "Erc20SwapSpotPriceExactTokenOut",
          args: {
            root: intentBatch.original.root
          }
        }
      ])
      return {
        original: intentBatch.original,
        raw: intentBatch.raw,
        invalidations: validationResults
      }
    })
    
    await Promise.all(validations).then((validations) => {
      const intentInvalidations = validations.map((value) => invalidateIntentBatch(value)).flat()
      intentInvalidations.forEach(async (invalidation: any) => {
        await invalidateIntentInDB(invalidation.intent.intentId)
      })
    })

    return response.status(200).json({
      message: "Intent batches invalidated successfully",
    });
  } catch (error) {
    next(error);
  }
};
