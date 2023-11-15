import { postIntentBatchDb } from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { getIronSession } from "iron-session";
import { recoverAddress } from 'viem';
import { z } from "zod";
import { ironOptions } from "../../iron-session";

export const postIntentBatchSchema = z.object({
  intentBatch: z.object({
    intentBatchHash: z.string(),
    nonce: z.string(),
    root: z.string(),
    chainId: z.number(),
    signature: z.string().length(132),
    strategyId: z.string(),
  }),
  intents: z.array(
    z.object({
      intentBatchId: z.string(),
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
        }),
      ),
    }),
  ),
});

export type PostIntentBatchApiParams = z.infer<typeof postIntentBatchSchema>;

export async function postIntentBatch(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const session = await getIronSession(request, response, ironOptions);

    if (!session?.address) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const { intentBatch, intents } = postIntentBatchSchema.parse(request.body);

    const recoveredAddress = await recoverAddress({
      signature: intentBatch.signature as `0x${string}`,
      hash: intentBatch.intentBatchHash as `0x${string}`,
    })

    // Prevent users from submitting intent batches on behalf of other users
    if (recoveredAddress !== session.address) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const { ok } = await postIntentBatchDb({
      intentBatch: {
        ...intentBatch,
        userId: session.address,
      },
      intents: intents.map((intent) => ({
        ...intent,
        value: Number(intent.value),
      })),
    });

    return response.status(200).json({ ok });
  } catch (error) {
    next(error);
  }
}
