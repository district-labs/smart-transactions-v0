import { useGetIntentifyModuleAddress } from "./use-get-intentify-module-address";
import { useGetSafeAddress } from "./use-get-safe-address";
import { useSafeIsModuleEnabled } from "@/blockchain";
import { useChainId } from "wagmi";

export function useIsSafeIntentModuleEnabled(watch = true) {
	const chainId = useChainId();
	const intentifyModuleAddress = useGetIntentifyModuleAddress(chainId);
	const safeAddress = useGetSafeAddress();

	const { data } = useSafeIsModuleEnabled({
		address: safeAddress,
		args: [intentifyModuleAddress],
		enabled: !!safeAddress,
		watch: watch,
	});

	return data;
}
