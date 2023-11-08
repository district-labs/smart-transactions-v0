import {
  intentifySafeModuleABI,
  type IntentBatchExecution,
} from "@district-labs/intentify-core"
import { IntentifySafeModule } from "@district-labs/intentify-deployments"
import { type Relayer } from "@openzeppelin/defender-relay-client"
import { encodeFunctionData, PublicClient } from "viem"

import { getRelayerAddress } from "../../../utils/relayer"

interface ExecuteIntentBatchParams {
  chainId: number
  publicClient: PublicClient
  relayer: Relayer
  intentBatchExecution: IntentBatchExecution
}

export async function executeIntentBatch({
  chainId,
  intentBatchExecution,
  publicClient,
  relayer,
}: ExecuteIntentBatchParams) {
  try {
    const intentifySafeModuleAddress = IntentifySafeModule[chainId]

    if (!intentifySafeModuleAddress) {
      throw new Error(`No IntentifyModuleAddress for chainId ${chainId}`)
    }

    const txData = encodeFunctionData({
      abi: intentifySafeModuleABI,
      functionName: "execute",
      args: [intentBatchExecution],
    })

    const searcherAddress = await getRelayerAddress(relayer)

    // Estimate gas
    const estimatedGas = await publicClient.estimateContractGas({
      address: intentifySafeModuleAddress,
      abi: intentifySafeModuleABI,
      functionName: "execute",
      account: searcherAddress,
      args: [intentBatchExecution],
    })

    // Add 50% to the estimated gas
    const gasLimit = Math.floor(Number(estimatedGas) * 1.5)

    const txReceipt = await relayer.sendTransaction({
      to: intentifySafeModuleAddress,
      data: txData,
      gasLimit,
      speed: "fast",
    })

    return { success: true, txReceipt } as const
  } catch (error: any) {
    return { success: false, message: String(error?.message) } as const
  }
}
