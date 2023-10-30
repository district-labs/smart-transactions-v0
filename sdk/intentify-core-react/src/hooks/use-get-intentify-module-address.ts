import { IntentifyModuleAddressList } from "@district-labs/intentify-core";

export function useGetIntentifyModuleAddress(chainId: number) {
  return IntentifyModuleAddressList[chainId];
}
