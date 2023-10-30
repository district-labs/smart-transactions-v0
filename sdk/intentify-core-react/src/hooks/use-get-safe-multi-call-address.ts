import { SafeMultiCall } from "@district-labs/intentify-deployments";

export function useGetSafeMultiCallAddress(chainId: number) {
  return SafeMultiCall[chainId];
}
