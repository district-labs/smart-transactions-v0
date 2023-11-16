import { addExpandParamsToUrl } from "@/src/utils";
import { getIntentBatchDb } from "@district-labs/intentify-database";

interface GetIntentBatchApiParams {
  intentBatchHash: string;
  expand?: {
    intents?: boolean;
    executedTxs?: boolean;
    user?: boolean;
    strategy?: boolean;
  };
}

export async function getIntentBatchApi(
  coreApiUrl: string,
  { intentBatchHash, expand }: GetIntentBatchApiParams,
) {
  if (intentBatchHash.length === 0)
    throw new Error("Intent Batch Hash is required");

  let url = new URL(`${coreApiUrl}intent-batches/${intentBatchHash}`);

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: Awaited<ReturnType<typeof getIntentBatchDb>> = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
