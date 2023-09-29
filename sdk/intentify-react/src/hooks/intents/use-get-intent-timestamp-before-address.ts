import { TimestampBeforeIntentAddressList } from "@district-labs/intentify-core";

export function useGetIntentTimestampBeforeAddress(chainId: number) {
  return TimestampBeforeIntentAddressList[chainId];
}
