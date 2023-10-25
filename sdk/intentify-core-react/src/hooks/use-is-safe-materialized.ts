import { useAccount, useChainId } from "wagmi";
import { useWalletFactoryIsWalletMaterialized } from "../blockchain";
import { ADDRESS_ZERO, DEFAULT_SALT } from "../data";
import { useGetSafeProxyAddress } from "./use-get-safe-proxy-address";
import { useGetWalletFactoryAddress } from "./use-get-wallet-factory-address";

export function useIsSafeMaterialized(watch = true) {
  const chainId = useChainId();
  const account = useAccount();
  const walletFactory = useGetWalletFactoryAddress(chainId);
  const safeProxyAddress = useGetSafeProxyAddress(chainId);

  const { data } = useWalletFactoryIsWalletMaterialized({
    address: walletFactory,
    args: [safeProxyAddress, account?.address || ADDRESS_ZERO, DEFAULT_SALT],
    enabled: !!walletFactory && !!safeProxyAddress && !!account?.address,
    watch: watch,
  });
  
  return data;
}
