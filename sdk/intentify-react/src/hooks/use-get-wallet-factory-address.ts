import { WalletFactoryAddressList } from "@district-labs/intentify-utils";


export function useGetWalletFactoryAddress(chainId: number) {
  return WalletFactoryAddressList[chainId];
}
