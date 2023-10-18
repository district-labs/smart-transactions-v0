import { IntentBatch, IntentifyModuleAddressList, getIntentBatchTypedDataHash } from "@district-labs/intentify-core";
import { useIntentifySafeModuleDomainSeparator } from "../../blockchain";
import { useChainId } from "wagmi";
import { isAddress } from "viem";

export function useGetIntentBatchTypedDataHash(intentBatch: IntentBatch) {
    const chainId = useChainId();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const {data, isSuccess} = useIntentifySafeModuleDomainSeparator({
        address: IntentifyModuleAddressList[chainId],
        chainId,
    })
    const intentBatchHash = isSuccess ? getIntentBatchTypedDataHash(data as `0x${string}`, intentBatch) : undefined;
    return isSuccess && intentBatchHash ? intentBatchHash : undefined;
}