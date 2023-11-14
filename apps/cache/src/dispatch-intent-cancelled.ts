import { cancelIntentBatchApi } from "@district-labs/intentify-api-actions";

interface DispatchIntentCancelledParams {
  intentBatchHash: `0x${string}`;
  transactionHash: `0x${string}`;
  transactionTimestamp: number;
}

export async function dispatchIntentCancelled({
  intentBatchHash,
  transactionHash,
  transactionTimestamp,
}: DispatchIntentCancelledParams) {
  try {
    await cancelIntentBatchApi({
      intentBatchHash,
      transactionHash,
      transactionTimestamp,
    });
  } catch (error) {
    console.log(error);
  }
}
