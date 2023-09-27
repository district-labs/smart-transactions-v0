import { SafeProxyFactoryAddressList } from "@district-labs/intentify-utils";


export function useGetSafeProxyFactoryAddress(chainId: number) {
  return SafeProxyFactoryAddressList[chainId];
}
