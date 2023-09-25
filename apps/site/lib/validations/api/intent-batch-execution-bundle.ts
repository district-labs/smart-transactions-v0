import { z } from "zod"

const hexStringPattern = /^0x[a-fA-F0-9]+$/;

const ApiIntentBatch = z.object({
    intentBatchId: z.number(),
    nonce: z.string().refine(value => hexStringPattern.test(value), {
        message: "root must be a hex string prefixed with '0x'",
    }),
    root: z.string().refine(value => hexStringPattern.test(value), {
        message: "root must be a hex string prefixed with '0x'",
    }),
    intents: z.array(
        z.object({
            root: z.string().refine(value => hexStringPattern.test(value), {
                message: "root must be a hex string prefixed with '0x'",
            }),
            target: z.string().refine(value => hexStringPattern.test(value), {
                message: "root must be a hex string prefixed with '0x'",
            }),
            value: z.number(),
            data: z.string().nullable(),
        })
    ),
})
  
export const hookSchema = z.object({
    target: z.string().refine(value => hexStringPattern.test(value), {
        message: "root must be a hex string prefixed with '0x'",
    }),
    data: z.string().refine(value => hexStringPattern.test(value), {
        message: "root must be a hex string prefixed with '0x'",
    }),
})

export const ApiIntentBatchExecution = z.object({
    batch: ApiIntentBatch,
    signature: z.object({
        v: z.number(),
        r: z.string(),
        s: z.string(),
    }),
    hooks: z.array(hookSchema)
})

export const ApiIntentBatchExecutionBundle = z.object({
  chainId: z.number(),
  executableIntentBatchBundle: z.array(ApiIntentBatchExecution)
})


export type ApiIntentBatchExecution = z.infer<typeof ApiIntentBatchExecution>
export type ApiIntentBatchExecutionBundle = z.infer<typeof ApiIntentBatchExecutionBundle>
export type ApiIntentBatch = z.infer<typeof ApiIntentBatch>
