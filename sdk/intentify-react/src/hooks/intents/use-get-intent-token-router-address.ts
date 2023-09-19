import { TokenRouterReleaseIntentAddressList } from "@/intent-modules";

export function useGetIntentTokenRouterAddress(chainId: number) {
  return TokenRouterReleaseIntentAddressList[chainId];
}
