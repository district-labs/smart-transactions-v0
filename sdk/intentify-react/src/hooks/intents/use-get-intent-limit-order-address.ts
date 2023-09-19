import { LimitOrderIntentAddressList } from "@/intent-modules";

export function useGetIntentLimitOrderAddress(chainId: number) {
  return LimitOrderIntentAddressList[chainId];
}
