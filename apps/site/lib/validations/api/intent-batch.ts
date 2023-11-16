import { z } from "zod"

export const ApiIntentBatch = z.object({
  intentBatch: z.object({
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
  }),
})

export type ApiIntentBatch = z.infer<typeof ApiIntentBatch>
