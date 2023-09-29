import { type ApiIntentBatchExecution } from "@/lib/validations/api/intent-batch-execution-bundle"

export function createContractArguments(
  intentBatchExecution: ApiIntentBatchExecution
): {
  batch: {
    nonce: `0x${string}`
    root: `0x${string}`
    intents: {
      root: `0x${string}`
      target: `0x${string}`
      value: bigint
      data: `0x${string}`
    }[]
  }
  signature: {
    v: number
    r: `0x${string}`
    s: `0x${string}`
  }
  hooks: {
    target: `0x${string}`
    data: `0x${string}`
  }[]
} {
  const { batch, signature, hooks } = intentBatchExecution
  const batchNew = {
    nonce: batch.nonce as `0x${string}`,
    root: batch.root as `0x${string}`,
    intents: batch.intents?.map((intent) => ({
      root: intent.root as `0x${string}`,
      target: intent.target as `0x${string}`,
      value: BigInt(intent.value),
      data: intent.data as `0x${string}`,
    })),
  }

  const sig = {
    v: signature.v,
    r: signature.r as `0x${string}`,
    s: signature.s as `0x${string}`,
  }

  const hooksNew = hooks.map((hook) => ({
    target: hook.target as `0x${string}`,
    data: hook.data as `0x${string}`,
  }))

  return {
    batch: batchNew,
    signature: sig,
    hooks: hooksNew,
  }
}
