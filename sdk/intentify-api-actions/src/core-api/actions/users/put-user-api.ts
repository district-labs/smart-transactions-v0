import { API_URL } from "@/src/constants";
import { putUserDb } from "@district-labs/intentify-database";

type PutUserApiParams = Parameters<typeof putUserDb>[0]["updatedUserData"];

type PutUserApiReturnType = {
  data: Awaited<ReturnType<typeof putUserDb>>;
};

export async function putUserApi(
  updatedUserData: PutUserApiParams,
): Promise<PutUserApiReturnType["data"]> {
  const response = await fetch(`${API_URL}/users/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUserData),
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
