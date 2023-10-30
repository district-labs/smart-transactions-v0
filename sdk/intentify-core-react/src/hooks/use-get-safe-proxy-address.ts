import { SafeProxy } from "@district-labs/intentify-deployments";

export function useGetSafeProxyAddress(chainId: number) {
  return SafeProxy[chainId];
}
