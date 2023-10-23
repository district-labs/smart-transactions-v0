import { LimitOrderIntentAddressList } from "@district-labs/intentify-core";

export function useGetIntentLimitOrderAddress(chainId: number) {
  return LimitOrderIntentAddressList[chainId];
}
