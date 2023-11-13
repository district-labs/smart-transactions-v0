import { API_URL } from "@/src/constants";
import { cancelIntentBatchDb } from "@district-labs/intentify-database";

type CancelIntentBatchApiParams = Parameters<typeof cancelIntentBatchDb>[0];


export async function cancelIntentBatchApi({intentBatchHash,transactionHash,transactionTimestamp}:CancelIntentBatchApiParams): Promise<ReturnType<typeof cancelIntentBatchDb>> {
  if(intentBatchHash.length === 0 ) throw new Error("Intent Batch Hash is required")
  if(transactionHash.length === 0 ) throw new Error("Transaction Hash is required")
  
  const url = new URL(`${API_URL}/intent-batches`);

  url.searchParams.append("action", "cancel");
  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intentBatchHash,
      transactionHash,
      transactionTimestamp,
    }),
  });

  if (response.ok) {
    const { data }= await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}