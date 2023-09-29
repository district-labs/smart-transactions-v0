import { WalletFactoryAddressList } from "@district-labs/intentify-core";


export function useGetWalletFactoryAddress(chainId: number) {
  return WalletFactoryAddressList[chainId];
}
