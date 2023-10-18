import { SafeMultiCallAddressList } from "@district-labs/intentify-core";

export function useGetSafeMultiCallAddress(chainId: number) {
  return SafeMultiCallAddressList[chainId];
}
