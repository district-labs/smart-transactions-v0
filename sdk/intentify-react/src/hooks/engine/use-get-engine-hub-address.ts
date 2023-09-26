import { EngineHubAddressList } from "../../intent-modules";

export function useGetEngineHubAddressList(chainId: number) {
  return EngineHubAddressList[chainId];
}
