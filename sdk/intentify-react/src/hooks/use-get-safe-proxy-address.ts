import { SafeProxyAddressList } from "../data";

export function useGetSafeProxyAddress(chainId: number) {
  return SafeProxyAddressList[chainId];
}
