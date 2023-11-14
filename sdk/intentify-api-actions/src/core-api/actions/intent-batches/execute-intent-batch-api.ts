import { API_URL } from "@/src/constants";
import { executeIntentBatchDb } from "@district-labs/intentify-database";

interface ExecuteIntentBatchApiParams {
  transactionParams: Parameters<typeof executeIntentBatchDb>[0];
}

export async function executeIntentBatchApi({
  transactionParams,
}: ExecuteIntentBatchApiParams): Promise<
  ReturnType<typeof executeIntentBatchDb>
> {
  const url = new URL(`${API_URL}/intent-batches`);

  url.searchParams.append("action", "execute");
  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionParams),
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
