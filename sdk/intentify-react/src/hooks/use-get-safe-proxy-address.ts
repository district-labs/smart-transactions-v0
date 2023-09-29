import { SafeProxyAddressList } from "@district-labs/intentify-core";


export function useGetSafeProxyAddress(chainId: number) {
  return SafeProxyAddressList[chainId];
}
