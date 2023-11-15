import { API_URL } from "@/src/constants";
import type { ExecuteIntentBatchApiParams } from "@district-labs/intentify-api";
import { executeIntentBatchDb } from "@district-labs/intentify-database";

export async function executeIntentBatchApi(executeIntentBatchParams:ExecuteIntentBatchApiParams): Promise<
  ReturnType<typeof executeIntentBatchDb>
> {
  const url = new URL(`${API_URL}intent-batches`);

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
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
