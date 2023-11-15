import { addExpandParamsToUrl } from "@/src/utils";
import { getUserDb } from "@district-labs/intentify-database";

interface GetAuthUserApiParams {
  expand?: {
    strategies?: boolean;
    emailPreferences?: boolean;
  };
}

export async function getAuthUserApi(
  coreApiUrl: string,
  { expand }: GetAuthUserApiParams = {},
) {
  let url = new URL(`${coreApiUrl}auth/user`);

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
}
