import { SafeProxyFactoryAddressList } from "@district-labs/intentify-core";


export function useGetSafeProxyFactoryAddress(chainId: number) {
  return SafeProxyFactoryAddressList[chainId];
}
