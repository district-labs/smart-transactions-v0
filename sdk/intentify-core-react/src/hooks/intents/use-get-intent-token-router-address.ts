import { TokenRouterReleaseIntentAddressList } from "@district-labs/intentify-core";

export function useGetIntentTokenRouterAddress(chainId: number) {
  return TokenRouterReleaseIntentAddressList[chainId];
}
