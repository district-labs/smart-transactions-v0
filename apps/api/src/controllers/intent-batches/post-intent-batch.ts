import { postIntentBatchDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const postIntentBatchSchema = z.object({
    intentBatchHash: z.string(),
    nonce: z.string(),
    root: z.string(),
    chainId: z.number(),
    signature: z.string(),
    userId: z.string(),
    strategyId: z.string(),
    intents: z.array(
      z.object({
        intentId: z.string(),
        root: z.string(),
        target: z.string(),
        value: z.string(),
        data: z.string().nullable(),
        intentArgs: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            value: z.union([z.string(), z.number()]),
          })
        ),
      })
    ),
});


export async function postIntentBatch(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const intentBatchData = postIntentBatchSchema.parse(request.body);

    const intentBatch = await postIntentBatchDb({
      ...intentBatchData,
      intents: intentBatchData.intents.map((intent) => ({
        ...intent,
        value: Number(intent.value),
        intentBatchId: intentBatchData.intentBatchHash,
      })),

    });

    return response.status(200).json({ data: intentBatch });
    
  } catch (error) {
    next(error);
  }
}
