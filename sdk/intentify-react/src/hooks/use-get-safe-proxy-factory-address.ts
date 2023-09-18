import { SafeProxyFactoryAddressList } from "../data";

export function useGetSafeProxyFactoryAddress(chainId: number) {
  return SafeProxyFactoryAddressList[chainId];
}
