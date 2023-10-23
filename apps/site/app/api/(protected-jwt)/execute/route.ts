import { createIntentExecutionBatchWithHooks } from "@/db/writes/intent-batch-execution"
import {
  IntentifyBundlerAddressList,
  IntentifyModuleAddressList,
  intentifySafeModuleBundlerABI,
} from "@district-labs/intentify-core"
import { encodeFunctionData, getContract } from "viem"

import { getRelayerByChainId } from "@/lib/openzeppelin-defender/relayer"
import { ApiIntentBatchExecutionBundle } from "@/lib/validations/api/intent-batch-execution-bundle"

import { localWalletClient } from "../../blockchain-clients"
import { createContractArguments } from "./utils"

const supportedChainIds = [5, 31337]
const GAS_LIMIT = BigInt(500000)

// TODO: Replace with actual executor address
const EXECUTOR_ADDRESS = "0x0000000000000000000000000000000000000000"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = ApiIntentBatchExecutionBundle.parse(body)
    const { chainId, executableIntentBatchBundle } = data

    if (!supportedChainIds.includes(chainId)) {
      throw new Error(`ChainId ${chainId} not supported`)
    }

    // Local chain
    if (chainId === 31337) {
      const localIntentModule = getContract({
        address: IntentifyBundlerAddressList[chainId],
        abi: intentifySafeModuleBundlerABI,
        walletClient: localWalletClient,
      })

      const txdataLocal = executableIntentBatchBundle.map(
        createContractArguments
      )
      localIntentModule.write.executeBundle(
        [IntentifyModuleAddressList[chainId], txdataLocal],
        {
          gas: GAS_LIMIT,
        }
      )

      executableIntentBatchBundle.map((intentBatch) => {
        const { hooks } = intentBatch
        createIntentExecutionBatchWithHooks({
          intentBatchHash: intentBatch.batch.intentBatchHash,
          executor: EXECUTOR_ADDRESS,
          hooksNew: hooks.map((hook) => ({
            target: hook.target,
            data: hook.data,
          })),
        })
      })

      return new Response(JSON.stringify({ ok: true }))
    } else {
      // Execute transaction using OpenZeppelin Defender Relayer
      const { relayer } = getRelayerByChainId(chainId)

      const txdata = executableIntentBatchBundle.map(createContractArguments)

      const data = encodeFunctionData({
        abi: intentifySafeModuleBundlerABI,
        functionName: "executeBundle",
        args: [IntentifyModuleAddressList[chainId], txdata],
      })

      const tx = await relayer.sendTransaction({
        to: IntentifyBundlerAddressList[chainId],
        gasLimit: GAS_LIMIT.toString(),
        data,
        speed: "fast",
      })

      return new Response(JSON.stringify(tx))
    }
  } catch (e) {
    console.log(e)
    return new Response(String(e))
  }
}
