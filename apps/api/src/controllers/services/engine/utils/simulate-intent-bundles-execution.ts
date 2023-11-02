import type { IntentBatchExecution } from "@district-labs/intentify-core";
import { intentifySafeModuleABI } from "@district-labs/intentify-core";
import { IntentifySafeModule } from "@district-labs/intentify-deployments";
import { accountShared, publicClients } from "../../../../blockchain-clients";

export async function simulateIntentBatchExecution(
  chainId: number,
  intentBatchExecution: IntentBatchExecution,
) {
  const publicClient = publicClients[chainId];
  if (!publicClient) throw new Error(`No client for chainId ${chainId}`);

  const address = IntentifySafeModule[chainId];
  if (!address)
    throw new Error(`No IntentifyModuleAddress for chainId ${chainId}`);

  return await publicClient.simulateContract({
    address: address,
    abi: intentifySafeModuleABI,
    functionName: "execute",
    args: [intentBatchExecution],
    account: accountShared,
  });
}
