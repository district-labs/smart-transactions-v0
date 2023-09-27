import { createIntentExecutionBatchWithHooks } from "@/db/writes/intent-batch-execution"
import {
  IntentifyBundlerAddressList,
  IntentifyModuleAddressList,
  intentifySafeModuleBundlerABI,
} from "@district-labs/intentify-utils"
import { getContract } from "viem"

import {
  ApiIntentBatchExecutionBundle,
  type ApiIntentBatchExecution,
} from "@/lib/validations/api/intent-batch-execution-bundle"

import { localWalletClient, mainnetWalletClient } from "../blockchain-clients"

export async function POST(req: Request) {
  const body = await req.json()
  const data = ApiIntentBatchExecutionBundle.parse(body)
  const { chainId, executableIntentBatchBundle } = data

  switch (chainId) {
    case 5:
      const goerliIntentModule = getContract({
        address: IntentifyBundlerAddressList[5],
        abi: intentifySafeModuleBundlerABI,
        walletClient: mainnetWalletClient,
      })

      const txdataGoerli = executableIntentBatchBundle.map(
        createContractArguments
      )
      goerliIntentModule.write.executeBundle(
        [IntentifyModuleAddressList[5], txdataGoerli],
        {
          gas: BigInt(500000),
        }
      )
      break
    case 31337:
      const localIntentModule = getContract({
        address: IntentifyBundlerAddressList[31337],
        abi: intentifySafeModuleBundlerABI,
        walletClient: localWalletClient,
      })

      const txdataLocal = executableIntentBatchBundle.map(
        createContractArguments
      )
      localIntentModule.write.executeBundle(
        [IntentifyModuleAddressList[31337], txdataLocal],
        {
          gas: BigInt(500000),
        }
      )

      executableIntentBatchBundle.map((intentBatch) => {
        const { hooks } = intentBatch
        createIntentExecutionBatchWithHooks(
          intentBatch.batch.intentBatchId,
          hooks.map((hook) => ({
            target: hook.target,
            data: hook.data,
          }))
        )
      })

      break
    default:
      throw new Error(`No client for chainId ${chainId}`)
  }

  console.log("Hello from Execute")
  return new Response()
}

function createContractArguments(
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
