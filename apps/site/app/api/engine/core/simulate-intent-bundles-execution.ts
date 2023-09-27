import {
  IntentifyModuleAddressList,
  intentifySafeModuleABI,
} from "@district-labs/intentify-utils"
import type { IntentBatchExecution } from "@district-labs/intentify-utils"

import { accountShared, publicClients } from "../../blockchain-clients"

export async function simulateIntentBatchExecution(
  chainId: number,
  intentBatchExecution: IntentBatchExecution
) {
  const publicClient = publicClients[chainId]
  if (!publicClient) throw new Error(`No client for chainId ${chainId}`)

  const address = IntentifyModuleAddressList[chainId]
  if (!address)
    throw new Error(`No IntentifyModuleAddress for chainId ${chainId}`)

  return await publicClient.simulateContract({
    address: address,
    abi: intentifySafeModuleABI,
    functionName: "execute",
    args: [intentBatchExecution],
    account: accountShared,
  })
}
