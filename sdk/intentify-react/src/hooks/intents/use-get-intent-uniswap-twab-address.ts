import { TokenRouterReleaseIntentAddressList } from "@/intent-modules";

export function useGetIntentUniswapTwabAddress(chainId: number) {
  return TokenRouterReleaseIntentAddressList[chainId];
}
