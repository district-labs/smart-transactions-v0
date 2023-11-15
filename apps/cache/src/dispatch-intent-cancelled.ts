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
  const CORE_API_URL = process.env.CORE_API_URL;

  if (!CORE_API_URL) {
    throw new Error("CORE_API_URL is not defined");
  }

  try {
    await cancelIntentBatchApi(CORE_API_URL,{
      intentBatchHash,
      transactionHash,
      transactionTimestamp,
    });
  } catch (error) {
    console.log(error);
  }
}
