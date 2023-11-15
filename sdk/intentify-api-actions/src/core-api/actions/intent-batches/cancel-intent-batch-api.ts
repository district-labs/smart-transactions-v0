import { API_URL } from "@/src/constants";
import type { CancelIntentBatchApiParams } from "@district-labs/intentify-api";
import { cancelIntentBatchDb } from "@district-labs/intentify-database";

export async function cancelIntentBatchApi(cancelIntentBatchParams: CancelIntentBatchApiParams): Promise<
  ReturnType<typeof cancelIntentBatchDb>
> {
  if (cancelIntentBatchParams.intentBatchHash.length === 0)
    throw new Error("Intent Batch Hash is required");
  if (cancelIntentBatchParams.transactionHash.length === 0)
    throw new Error("Transaction Hash is required");

  const url = new URL(`${API_URL}intent-batches`);

  url.searchParams.append("action", "cancel");
  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cancelIntentBatchParams),
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
