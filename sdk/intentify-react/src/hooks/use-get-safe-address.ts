import { ADDRESS_ZERO, DEFAULT_SALT } from "../data";
import { useGetSafeProxyAddress } from "./use-get-safe-proxy-address";
import { useGetWalletFactoryAddress } from "./use-get-wallet-factory-address";
import {
	useWalletFactoryGetDeterministicWalletAddress,
	useWalletFactoryIsWalletMaterialized,
} from "@/blockchain";
import { useAccount, useChainId } from "wagmi";

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