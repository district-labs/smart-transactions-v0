import { z } from "zod";

export type NewLimitOrderSchema = z.infer<typeof newLimitOrderSchema>

export const newLimitOrderSchema = z.object({
  intentBatchEIP712: z.any(),
  intentBatch: z.object({
    nonce: z.string(),
    root: z.string(),
    chainId: z.number(),
    signature: z.string(),
    intents: z.array(
      z.object({
        name: z.string(),
        version: z.string(),
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
  }),
})