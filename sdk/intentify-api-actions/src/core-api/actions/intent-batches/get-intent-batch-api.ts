import { addExpandParamsToUrl } from "@/src/utils";
import { getIntentBatchDb } from "@district-labs/intentify-database";
import { API_URL } from "../../../constants";

interface GetIntentBatchApiParams {
  intentBatchHash: string;
  expand?: {
    intents?: boolean;
    executedTxs?: boolean;
    user?: boolean;
    strategy?: boolean;
  };
}

interface GetIntentBatchApiReturnType {
  data: Awaited<ReturnType<typeof getIntentBatchDb>>;
}

export async function getIntentBatchApi({
  intentBatchHash,
  expand,
}: GetIntentBatchApiParams) {
  if (intentBatchHash.length === 0)
    throw new Error("Intent Batch Hash is required");

  let url = new URL(`${API_URL}/intent-batches/${intentBatchHash}`);

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const { data }: GetIntentBatchApiReturnType = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
