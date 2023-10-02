import { TimestampIntentAddressList } from "@district-labs/intentify-core";

export function useGetIntentTimestampAddress(chainId: number) {
  return TimestampIntentAddressList[chainId];
}
