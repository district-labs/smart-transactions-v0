import { WalletFactoryAddressList } from "../data";

export function useGetWalletFactoryAddress(chainId: number) {
  return WalletFactoryAddressList[chainId];
}
