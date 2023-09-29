import { SafeMultiCallAddressList } from "@district-labs/intentify-utils";

export function useGetSafeMultiCallAddress(chainId: number) {
  return SafeMultiCallAddressList[chainId];
}
