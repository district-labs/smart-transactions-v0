import { useAccount, useChainId } from "wagmi";
import {
  useWalletFactoryGetDeterministicWalletAddress
} from "../blockchain";
import { ADDRESS_ZERO, DEFAULT_SALT } from "@district-labs/intentify-core";;
import { useGetSafeProxyAddress } from "./use-get-safe-proxy-address";
import { useGetWalletFactoryAddress } from "./use-get-wallet-factory-address";

export function useGetSafeAddress() {
  const chainId = useChainId();
  const account = useAccount();
  const walletFactory = useGetWalletFactoryAddress(chainId);
  const safeProxyAddress = useGetSafeProxyAddress(chainId);

  const { data } = useWalletFactoryGetDeterministicWalletAddress({
    address: walletFactory,
    args: [safeProxyAddress, account?.address || ADDRESS_ZERO, DEFAULT_SALT],
    enabled: !!walletFactory && !!safeProxyAddress && !!account?.address,
  });

  return data;
}
