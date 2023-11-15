import { API_URL } from "@/src/constants";
import type { PutUserApiParams } from "@district-labs/intentify-api";
import { putUserDb } from "@district-labs/intentify-database";

type PutUserApiReturnType = {
  data: Awaited<ReturnType<typeof putUserDb>>;
};

export async function putUserApi(
  putUserparams: PutUserApiParams,
): Promise<PutUserApiReturnType["data"]> {
  const response = await fetch(`${API_URL}users/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(putUserparams),
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
