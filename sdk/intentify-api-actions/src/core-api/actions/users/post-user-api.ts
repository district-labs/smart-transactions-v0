import { API_URL } from "@/src/constants";
import { postUserDb } from "@district-labs/intentify-database";

type PostUserApiParams = Parameters<typeof postUserDb>[0]["newUserData"];

export async function postUserApi(
  newUserData: PostUserApiParams,
): Promise<Awaited<ReturnType<typeof postUserDb>>["data"]> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUserData),
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
