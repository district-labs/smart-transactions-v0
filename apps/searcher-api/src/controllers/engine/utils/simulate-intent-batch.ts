import type { IntentBatchExecution } from "@district-labs/intentify-core"
import { intentifySafeModuleABI } from "@district-labs/intentify-core"
import { IntentifySafeModule } from "@district-labs/intentify-deployments"
import type { Address, PublicClient } from "viem"

interface SimulateIntentBatchParams {
  chainId: number
  intentBatchExecution: IntentBatchExecution
  publicClient: PublicClient
  searcherAddress: Address
}

export async function simulateIntentBatch({
  chainId,
  intentBatchExecution,
  publicClient,
  searcherAddress,
}: SimulateIntentBatchParams) {
  try {
    const intentifySafeModuleAddress = IntentifySafeModule[chainId]

    if (!intentifySafeModuleAddress) {
      throw new Error(`No IntentifyModuleAddress for chainId ${chainId}`)
    }

    await publicClient.simulateContract({
      address: intentifySafeModuleAddress,
      abi: intentifySafeModuleABI,
      functionName: "execute",
      args: [intentBatchExecution],
      account: searcherAddress,
    })

    return {
      success: true,
      message: "Intent batch execution is valid",
    } as const
  } catch (error: any) {
    console.error(error)
    return { success: false, message: String(error?.message) } as const
  }
}
