import { IntentifyModuleAddressList } from "@district-labs/intentify-utils";

export function useGetIntentifyModuleAddress(chainId: number) {
  return IntentifyModuleAddressList[chainId];
}
