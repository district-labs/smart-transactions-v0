import { intentifySafeModuleABI } from "@district-labs/intentify-utils"
import type { IntentBatchExecution } from "@district-labs/intentify-utils"

import { publicClients } from "@/app/api/engine/networks"

export async function simulateMultipleIntentBundleWithMulticall(
  chainId: number,
  intentBundleWithHooks: IntentBatchExecution
) {
  const publicClient = publicClients[chainId]
  if (!publicClient) throw new Error(`No client for chainId ${chainId}`)

  return await publicClient.simulateContract({
    address: "0x000",
    abi: intentifySafeModuleABI,
    functionName: "execute",
    args: [intentBundleWithHooks],
  })
}
