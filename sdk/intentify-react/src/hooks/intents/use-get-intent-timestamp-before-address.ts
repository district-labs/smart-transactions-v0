import { TimestampBeforeIntentAddressList } from "@district-labs/intentify-utils";

export function useGetIntentTimestampBeforeAddress(chainId: number) {
  return TimestampBeforeIntentAddressList[chainId];
}
