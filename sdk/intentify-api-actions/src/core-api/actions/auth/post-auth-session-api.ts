import { API_URL } from "@/src/constants";
import type { PostAuthSessionApiParams } from "@district-labs/intentify-api";

export async function postAuthSessionApi(postAuthSessionParams: PostAuthSessionApiParams) {
  const url = new URL(`${API_URL}auth/session`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postAuthSessionParams),
  });

  if (response.ok) {
    const data: { ok: boolean } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
