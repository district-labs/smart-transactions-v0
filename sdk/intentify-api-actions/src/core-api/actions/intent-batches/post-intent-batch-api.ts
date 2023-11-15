import type { PostIntentBatchApiParams } from "@district-labs/intentify-api";
import { postIntentBatchDb } from "@district-labs/intentify-database";

export async function postIntentBatchApi(
  coreApiUrl: string,
  postIntentBatchParams: PostIntentBatchApiParams,
): Promise<ReturnType<typeof postIntentBatchDb>> {
  const url = new URL(`${coreApiUrl}intent-batches`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postIntentBatchParams),
  });

  if (response.ok) {
    const responseJson = await response.json();
    return responseJson;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
