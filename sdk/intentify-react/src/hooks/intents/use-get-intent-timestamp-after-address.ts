import { TimestampAfterIntentAddressList } from "@district-labs/intentify-core";

export function useGetIntentTimestampAfterAddress(chainId: number) {
  return TimestampAfterIntentAddressList[chainId];
}
