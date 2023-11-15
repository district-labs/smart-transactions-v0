import { addExpandParamsToUrl } from "@/src/utils";
import { getUserDb } from "@district-labs/intentify-database";
import type { Address } from "viem";

interface GetUserApiParams {
  address: Address;
  expand?: {
    strategies?: boolean;
    emailPreferences?: boolean;
  };
}

export async function getUserApi(
  coreApiUrl: string,
  { address, expand }: GetUserApiParams,
) {
  if (address.length === 0) throw new Error("Address is required");

  let url = new URL(`${coreApiUrl}users/${address}`);

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: Awaited<ReturnType<typeof getUserDb>> = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
