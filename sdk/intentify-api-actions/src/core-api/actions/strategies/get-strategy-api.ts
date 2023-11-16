import { addExpandParamsToUrl } from "@/src/utils";
import { getStrategyDb } from "@district-labs/intentify-database";

interface GetStrategyApiParams {
  strategyId: string;
  expand?: {
    manager?: boolean;
    intentBatches?: boolean;
  };
}

export async function getStrategyApi(
  coreApiUrl: string,
  { strategyId, expand }: GetStrategyApiParams,
) {
  if (strategyId.length === 0) throw new Error("Strategy ID is required");

  let url = new URL(`${coreApiUrl}strategies/${strategyId}`);

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: Awaited<ReturnType<typeof getStrategyDb>> = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
