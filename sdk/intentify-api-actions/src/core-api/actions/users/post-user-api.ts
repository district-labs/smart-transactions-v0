import { API_URL } from "@/src/constants";
import type { PostUserApiParams } from "@district-labs/intentify-api";
import { postUserDb } from "@district-labs/intentify-database";

export async function postUserApi(
  postUserParams: PostUserApiParams,
): Promise<Awaited<ReturnType<typeof postUserDb>>["data"]> {
  const response = await fetch(`${API_URL}users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postUserParams),
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
