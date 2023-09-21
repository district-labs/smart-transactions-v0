import { TimestampBeforeIntentAddressList } from "../../intent-modules";

export function useGetIntentTimestampBeforeAddress(chainId: number) {
  return TimestampBeforeIntentAddressList[chainId];
}
