import { API_URL } from "@/src/constants";
import { postIntentBatchDb } from "@district-labs/intentify-database";

type PostIntentBatchApiParams = Parameters<typeof postIntentBatchDb>[0];

export async function postIntentBatchApi(intentBatchData: PostIntentBatchApiParams):Promise<ReturnType<typeof postIntentBatchDb>>{
  const url = new URL(`${API_URL}/intent-batches`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(intentBatchData),
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
