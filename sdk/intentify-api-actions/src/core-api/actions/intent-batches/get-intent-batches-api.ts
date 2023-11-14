import { addExpandParamsToUrl } from "@/src/utils";
import { getIntentBatchesDb } from "@district-labs/intentify-database";
import { API_URL } from "../../../constants";

interface GetIntentBatchesApiParams {
  limit?: number;
  offset?: number;
  filter?: {
    root?: string;
    strategyId?: string;
  };
  expand?: {
    intents?: boolean;
    executedTxs?: boolean;
    user?: boolean;
    strategy?: boolean;
  };
}

interface GetIntentBatchesApiReturnType {
  data: Awaited<ReturnType<typeof getIntentBatchesDb>>;
}

export async function getIntentBatchesApi({
  limit,
  offset,
  expand,
  filter,
}: GetIntentBatchesApiParams = {}) {
  let url = new URL(`${API_URL}/intent-batches`);
  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }

  if (offset) {
    url.searchParams.append("offset", offset.toString());
  }

  if (filter?.root) {
    url.searchParams.append("root", filter?.root);
  }

  if (filter?.strategyId) {
    url.searchParams.append("strategyId", filter?.strategyId);
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
    const { data }: GetIntentBatchesApiReturnType = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
