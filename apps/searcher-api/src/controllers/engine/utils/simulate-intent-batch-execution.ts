import type { IntentBatchExecution } from "@district-labs/intentify-core"
import { intentifySafeModuleABI } from "@district-labs/intentify-core"
import { IntentifySafeModule } from "@district-labs/intentify-deployments"
import type { Address, PublicClient } from "viem"

interface SimulateIntentBatchExecutionParams {
  chainId: number
  intentBatchExecution: IntentBatchExecution
  publicClient: PublicClient
  searcherAddress: Address
}

export async function simulateIntentBatchExecution({
  chainId,
  intentBatchExecution,
  publicClient,
  searcherAddress,
}: SimulateIntentBatchExecutionParams) {
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

}
