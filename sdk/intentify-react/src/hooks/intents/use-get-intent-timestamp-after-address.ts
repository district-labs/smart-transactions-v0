import { TimestampAfterIntentAddressList } from "@district-labs/intentify-utils";

export function useGetIntentTimestampAfterAddress(chainId: number) {
  return TimestampAfterIntentAddressList[chainId];
}
