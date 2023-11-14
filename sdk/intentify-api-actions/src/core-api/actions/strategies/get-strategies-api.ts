import { addExpandParamsToUrl } from "@/src/utils";
import { getStrategiesDb } from "@district-labs/intentify-database";
import { API_URL } from "../../../constants";

interface GetStrategiesApiParams {
  limit?: number;
  offset?: number;
  expand?: {
    manager?: boolean;
    intentBatches?: boolean;
  };
}

interface GetStrategiesApiReturnType {
  data: Awaited<ReturnType<typeof getStrategiesDb>>;
}

export async function getStrategiesApi({
  limit,
  offset,
  expand,
}: GetStrategiesApiParams = {}) {
  let url = new URL(`${API_URL}/strategies`);
  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }

  if (offset) {
    url.searchParams.append("offset", offset.toString());
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
    const { data }: GetStrategiesApiReturnType = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
