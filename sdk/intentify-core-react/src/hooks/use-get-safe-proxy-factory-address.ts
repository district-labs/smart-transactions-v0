import { SafeProxyFactory } from "@district-labs/intentify-deployments";


export function useGetSafeProxyFactoryAddress(chainId: number) {
  return SafeProxyFactory[chainId];
}
