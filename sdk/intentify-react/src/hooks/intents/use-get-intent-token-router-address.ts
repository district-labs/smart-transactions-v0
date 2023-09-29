import { TokenRouterReleaseIntentAddressList } from "@district-labs/intentify-utils";

export function useGetIntentTokenRouterAddress(chainId: number) {
  return TokenRouterReleaseIntentAddressList[chainId];
}
