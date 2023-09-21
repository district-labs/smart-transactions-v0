import { useChainId } from "wagmi";
import { useSafeIsModuleEnabled } from "../blockchain";
import { useGetIntentifyModuleAddress } from "./use-get-intentify-module-address";
import { useGetSafeAddress } from "./use-get-safe-address";

export function useIsSafeIntentModuleEnabled(watch = true) {
  const chainId = useChainId();
  const intentifyModuleAddress = useGetIntentifyModuleAddress(chainId);
  const safeAddress = useGetSafeAddress();

  const { data } = useSafeIsModuleEnabled({
    address: safeAddress,
    args: [intentifyModuleAddress],
    enabled: !!safeAddress,
    watch: watch,
  });

  return data;
}
