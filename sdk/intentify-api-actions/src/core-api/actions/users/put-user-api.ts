import type { PutUserApiParams } from "@district-labs/intentify-api";
import { putUserDb } from "@district-labs/intentify-database";

export async function putUserApi(
  coreApiUrl: string,
  putUserparams: PutUserApiParams,
) {
  const response = await fetch(`${coreApiUrl}users/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(putUserparams),
  });

  if (response.ok) {
    const data: Awaited<ReturnType<typeof putUserDb>> = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
