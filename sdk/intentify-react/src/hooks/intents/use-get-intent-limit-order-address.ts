import { LimitOrderIntentAddressList } from "@/intent-modules";

export function useGetIntentTokenRouterAddress(chainId: number) {
  return LimitOrderIntentAddressList[chainId];
}
