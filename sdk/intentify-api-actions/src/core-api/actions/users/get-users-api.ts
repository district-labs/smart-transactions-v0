import { addExpandParamsToUrl } from "@/src/utils";
import { getUsersDb } from "@district-labs/intentify-database";

interface GetUsersApiParams {
  limit?: number;
  offset?: number;
  expand?: {
    strategies?: boolean;
    emailPreferences?: boolean;
  };
}

export async function getUsersApi(
  coreApiUrl: string,
  { expand, limit, offset }: GetUsersApiParams = {},
) {
  let url = new URL(`${coreApiUrl}users`);

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
    const data : Awaited<ReturnType<typeof getUsersDb>> = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
