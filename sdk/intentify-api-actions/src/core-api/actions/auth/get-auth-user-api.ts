import { API_URL } from "@/src/constants";
import { addExpandParamsToUrl } from "@/src/utils";
import { getUserDb } from "@district-labs/intentify-database";

interface GetAuthUserApiParams {
  expand?: {
    strategies?: boolean;
    emailPreferences?: boolean;
  };
}

type GetAuthUserApiReturnType = {
  data: Awaited<ReturnType<typeof getUserDb>>;
};
export async function getAuthUserApi({ expand }: GetAuthUserApiParams = {}) {
  let url = new URL(`${API_URL}/auth/user`);

  url = addExpandParamsToUrl(url, expand);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const { data }: GetAuthUserApiReturnType = await response.json();
    return data;
  }
}
