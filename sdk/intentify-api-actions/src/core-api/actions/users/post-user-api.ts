import type { PostUserApiParams } from "@district-labs/intentify-api";
import { postUserDb } from "@district-labs/intentify-database";

export async function postUserApi(
  coreApiUrl: string,
  postUserParams: PostUserApiParams,
): Promise<Awaited<ReturnType<typeof postUserDb>>> {
  const response = await fetch(`${coreApiUrl}users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postUserParams),
  });

  if (response.ok) {
    const data: Awaited<ReturnType<typeof postUserDb>> = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
