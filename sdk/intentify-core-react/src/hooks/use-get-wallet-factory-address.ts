import { WalletFactory } from "@district-labs/intentify-deployments";

export function useGetWalletFactoryAddress(chainId: number) {
  return WalletFactory[chainId];
}
