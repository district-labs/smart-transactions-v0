import { IntentifySafeModule } from "@district-labs/intentify-deployments";
import { IntentBatch, getIntentBatchTypedDataHash } from "@district-labs/intentify-core";
import { useIntentifySafeModuleDomainSeparator } from "../../blockchain";
import { useChainId } from "wagmi";

export function useGetIntentBatchTypedDataHash(intentBatch: IntentBatch) {
    const chainId = useChainId();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const {data, isSuccess} = useIntentifySafeModuleDomainSeparator({
        address: IntentifySafeModule[chainId],
        chainId,
    })
    const intentBatchHash = isSuccess ? getIntentBatchTypedDataHash(data as `0x${string}`, intentBatch) : undefined;
    return isSuccess && intentBatchHash ? intentBatchHash : undefined;
}