import { addExpandParamsToUrl } from "@/src/utils";
import { getStrategyDb } from "@district-labs/intentify-database";
import { API_URL } from "../../constants";

interface GetStrategyApiParams {
  strategyId: string;
  expand?: {
    manager?: boolean;
    intentBatches?: boolean;
  };
}
interface GetStrategyApiReturnType {
  data: Awaited<ReturnType<typeof getStrategyDb>>;
}

export async function getStrategyApi({
  strategyId,
  expand,
}: GetStrategyApiParams) {
  if(strategyId.length === 0 ) throw new Error("Strategy ID is required")
  
  let url = new URL(`${API_URL}/strategies/${strategyId}`);

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const { data }: GetStrategyApiReturnType = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
