import {
  db,
  eq,
  intentBatch,
  transaction,
} from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { invalidateIntentInDB } from "../../models/intent";
import { getIntentBatchesFromDB } from "../../models/intent-batch";
import { IntentBatchValidationStruct } from "../../types";
import { transformIntentBatchQueryToStruct } from "../../utils/transform-intent-batch-query-to-struct";
import {
  getExpandFields,
  getExpandFieldsSchema,
} from "../../validations/queries";
import {
  intentBatchFactoryForValidation,
  invalidateIntentBatch,
} from "../utils/intent-batches";

const expandFieldsGetIntentBatches = [
  "intents",
  "executedTxs",
  "user",
  "strategy",
];
const getIntentBatchesQuerySchema = z.object({
  limit: z.string().optional(),
  offset: z.string().optional(),
  expand: getExpandFieldsSchema(expandFieldsGetIntentBatches),
});

export async function getIntentBatches(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { expand, limit, offset } = getIntentBatchesQuerySchema.parse(
      request.query,
    );

    const expandFields = getExpandFields(expand);

    const intentBatches = await db.query.intentBatch.findMany({
      limit: Number(limit),
      offset: Number(offset),
      with: {
        intents: expandFields.includes("intents") ? true : undefined,
        executedTxs: expandFields.includes("executedTxs") ? true : undefined,
        user: expandFields.includes("user") ? true : undefined,
        strategy: expandFields.includes("strategy") ? true : undefined,
      },
    });

    return response.status(200).json({ data: intentBatches });
  } catch (error) {
    next(error);
  }
}

const getIntentBatchQuerySchema = z.object({
  expand: getExpandFieldsSchema(expandFieldsGetIntentBatches),
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

    const existingIntentBatch = await db.query.intentBatch.findFirst({
      where: eq(intentBatch.intentBatchHash, intentBatchHash),
      with: {
        intents: expandFields.includes("intents") ? true : undefined,
        executedTxs: expandFields.includes("executedTxs") ? true : undefined,
        user: expandFields.includes("user") ? true : undefined,
        strategy: expandFields.includes("strategy") ? true : undefined,
      },
    });

    if (!existingIntentBatch) {
      return response.status(404).json({ error: "Intent batch not found" });
    }

    return response.status(200).json({ data: existingIntentBatch });
  } catch (error) {
    next(error);
  }
}

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
const patchIntentExecuteBatchesBodySchema = z.object({
  chainId: z.number(),
  intentBatchHash: z.string(),
  transactionHash: z.string(),
  blockHash: z.string(),
  blockNumber: z.number(),
  to: z.string(),
});
const patchIntentInvalidateBatchesBodySchema = z.object({});

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
        const updatedIntentBatch = await db
          .update(intentBatch)
          .set({
            cancelledTxHash: transactionHash,
            cancelledAt: new Date(transactionTimestamp),
          })
          .where(eq(intentBatch.intentBatchHash, intentBatchHash));
        if (!updatedIntentBatch) {
          return response.status(404).json({ error: "Intent batch not found" });
        }

        return response.status(200).json({ data: updatedIntentBatch });
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

        const insertedTransaction = await db.insert(transaction).values({
          intentBatchId: intentBatchHash,
          to,
          chainId,
          blockHash,
          blockNumber,
          transactionHash,
        });

        if (!insertedTransaction) {
          return response.status(404).json({ error: "Transaction not found" });
        }

        return response.status(200).json({ data: insertedTransaction });
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
          await invalidateIntentInDB(invalidation.intent.intentId);
        });

        return response.status(200).json({
          data: intentInvalidations,
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
