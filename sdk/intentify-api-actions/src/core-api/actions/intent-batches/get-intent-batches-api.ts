import { addExpandParamsToUrl } from "@/src/utils";
import { getIntentBatchesDb } from "@district-labs/intentify-database";

export interface GetIntentBatchesApiParams {
  limit?: number;
  offset?: number;
  filter?: {
    root?: string;
    strategyId?: string;
    intentBatchValidity?: "valid" | "invalid" | "all";
  };
  expand?: {
    intents?: boolean;
    executedTxs?: boolean;
    user?: boolean;
    strategy?: boolean;
  };
}

export async function getIntentBatchesApi(
  coreApiUrl: string,
  { limit, offset, expand, filter }: GetIntentBatchesApiParams = {},
) {
  let url = new URL(`${coreApiUrl}intent-batches`);
  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }

  if (offset) {
    url.searchParams.append("offset", offset.toString());
  }

  if (filter?.root) {
    url.searchParams.append("root", filter.root);
  }

  if (filter?.strategyId) {
    url.searchParams.append("strategyId", filter.strategyId);
  }

  if (filter?.intentBatchValidity) {
    url.searchParams.append("intentBatchValidity", filter.intentBatchValidity);
  }

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data : Awaited<ReturnType<typeof getIntentBatchesDb>> = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
