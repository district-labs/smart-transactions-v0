import { IntentifySafeModule } from "@district-labs/intentify-deployments";

export function useGetIntentifyModuleAddress(chainId: number) {
  return IntentifySafeModule[chainId];
}
