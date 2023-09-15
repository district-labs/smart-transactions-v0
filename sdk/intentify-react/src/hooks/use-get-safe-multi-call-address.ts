import { SafeMultiCallAddressList } from "../data";

export function useGetSafeMultiCallAddress(chainId: number) {
  return SafeMultiCallAddressList[chainId];
}
