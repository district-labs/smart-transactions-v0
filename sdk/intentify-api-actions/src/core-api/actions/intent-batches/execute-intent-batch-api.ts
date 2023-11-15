import type { ExecuteIntentBatchApiParams } from "@district-labs/intentify-api";
import { executeIntentBatchDb } from "@district-labs/intentify-database";

export async function executeIntentBatchApi(
  coreApiUrl: string,
  executeIntentBatchParams: ExecuteIntentBatchApiParams,
): Promise<ReturnType<typeof executeIntentBatchDb>> {
  const url = new URL(`${coreApiUrl}intent-batches`);

  url.searchParams.append("action", "execute");
  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(executeIntentBatchParams),
  });

  if (response.ok) {
    const data: Awaited<ReturnType<typeof executeIntentBatchDb>> =
      await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
