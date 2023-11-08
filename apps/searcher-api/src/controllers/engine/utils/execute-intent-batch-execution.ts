import {
  intentifySafeModuleABI,
  type IntentBatchExecution,
} from "@district-labs/intentify-core"
import { IntentifySafeModule } from "@district-labs/intentify-deployments"
import { type Relayer } from "@openzeppelin/defender-relay-client"
import { encodeFunctionData, type PublicClient } from "viem"

interface ExecuteIntentBatchExecutionParams {
  chainId: number
  publicClient: PublicClient
  relayer: Relayer
  intentBatchExecution: IntentBatchExecution
}

export async function executeIntentBatchExecution({
  chainId,
  intentBatchExecution,
  publicClient,
  relayer,
}: ExecuteIntentBatchExecutionParams) {
  const intentifySafeModuleAddress = IntentifySafeModule[chainId]

  if (!intentifySafeModuleAddress) {
    throw new Error(`No IntentifyModuleAddress for chainId ${chainId}`)
  }

  const txData = encodeFunctionData({
    abi: intentifySafeModuleABI,
    functionName: "execute",
    args: [intentBatchExecution],
  })

  const txReceipt = await relayer.sendTransaction({
    to: intentifySafeModuleAddress,
    data: txData,
    gasLimit: 500000,
    speed: "fast",
  })

  await publicClient.waitForTransactionReceipt({
    hash: txReceipt.hash as `0x${string}`,
  })

  return txReceipt
}
