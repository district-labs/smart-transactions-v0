import { addExpandParamsToUrl } from "@/src/utils";
import { getUserDb } from "@district-labs/intentify-database";
import type { Address } from "viem";
import { API_URL } from "../../../constants";

interface GetUserApiParams {
  address: Address;
  expand?: {
    strategies?: boolean;
    emailPreferences?: boolean;
  };
}

type GetUserApiReturnType = {
  data: Awaited<ReturnType<typeof getUserDb>>;
};

export async function getUserApi({ address, expand }: GetUserApiParams) {
  if (address.length === 0) throw new Error("Address is required");

  let url = new URL(`${API_URL}/users/${address}`);

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const { data }: GetUserApiReturnType = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
