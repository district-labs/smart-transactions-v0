import { SafeProxyAddressList } from "@district-labs/intentify-utils";


export function useGetSafeProxyAddress(chainId: number) {
  return SafeProxyAddressList[chainId];
}
