import { LimitOrderIntentAddressList } from "@district-labs/intentify-utils";

export function useGetIntentLimitOrderAddress(chainId: number) {
  return LimitOrderIntentAddressList[chainId];
}
