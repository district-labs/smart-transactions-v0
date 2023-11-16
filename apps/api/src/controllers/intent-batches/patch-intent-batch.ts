import {
  cancelIntentBatchDb,
  executeIntentBatchDb,
  invalidateIntentsDb,
} from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getIntentBatchesFromDB } from "../../models/intent-batch";
import { IntentBatchValidationStruct } from "../../types";
import { transformIntentBatchQueryToStruct } from "../../utils/transform-intent-batch-query-to-struct";
import {
  intentBatchFactoryForValidation,
  invalidateIntentBatch,
} from "../utils/intent-batches";

const patchIntentBatchQuerySchema = z.object({
  action: z.union([
    z.literal("cancel"),
    z.literal("execute"),
    z.literal("invalidate"),
  ]),
});

const patchIntentCancelBatchesBodySchema = z.object({
  intentBatchHash: z.string(),
  transactionHash: z.string(),
  transactionTimestamp: z.number(),
});
export type CancelIntentBatchApiParams = z.infer<
  typeof patchIntentCancelBatchesBodySchema
>;

const patchIntentExecuteBatchesBodySchema = z.object({
  chainId: z.number(),
  intentBatchHash: z.string(),
  transactionHash: z.string(),
  blockHash: z.string(),
  blockNumber: z.number(),
  to: z.string(),
});
export type ExecuteIntentBatchApiParams = z.infer<
  typeof patchIntentExecuteBatchesBodySchema
>;

export async function patchIntentBatches(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { action } = patchIntentBatchQuerySchema.parse(request.query);

    switch (action) {
      case "cancel": {
        const { intentBatchHash, transactionHash, transactionTimestamp } =
          patchIntentCancelBatchesBodySchema.parse(request.body);

        const cancelledIntentBatch = await cancelIntentBatchDb({
          intentBatchHash,
          transactionHash,
          transactionTimestamp,
        });

        if (!cancelledIntentBatch.ok) {
          return response.status(404).json(cancelledIntentBatch);
        }

        return response.status(200).json(cancelledIntentBatch);
      }
      case "execute": {
        const {
          blockHash,
          blockNumber,
          chainId,
          intentBatchHash,
          to,
          transactionHash,
        } = patchIntentExecuteBatchesBodySchema.parse(request.body);

        const insertedTransaction = await executeIntentBatchDb({
          blockHash,
          blockNumber,
          chainId,
          intentBatchId: intentBatchHash,
          to,
          transactionHash,
        });

        if (!insertedTransaction.ok) {
          return response.status(404).json(insertedTransaction);
        }

        return response.status(200).json(insertedTransaction);
      }
      case "invalidate": {
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
          await invalidateIntentsDb(invalidation.intent.intentId);
        });

        return response.status(200).json({
          ok: true,
        });
      }
      default: {
        return response.status(400).json({ error: "Invalid action" });
      }
    }
  } catch (error) {
    next(error);
  }
}
