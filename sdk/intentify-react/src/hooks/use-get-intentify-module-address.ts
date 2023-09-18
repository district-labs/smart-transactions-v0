import { IntentifyModuleAddressList } from "../data";

export function useGetIntentifyModuleAddress(chainId: number) {
	return IntentifyModuleAddressList[chainId];
}
