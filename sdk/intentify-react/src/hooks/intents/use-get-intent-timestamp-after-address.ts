import { TimestampAfterIntentAddressList } from "../../intent-modules";

export function useGetIntentTimestampAfterAddress(chainId: number) {
  return TimestampAfterIntentAddressList[chainId];
}
