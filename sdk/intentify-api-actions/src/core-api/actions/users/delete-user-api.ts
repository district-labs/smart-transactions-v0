import { deleteUserDb } from "@district-labs/intentify-database";
import { API_URL } from "../../../constants";

interface DeleteUserParams {
  userAddress: string;
}

export async function deleteUserApi({
  userAddress,
}: DeleteUserParams): Promise<
  Awaited<ReturnType<typeof deleteUserDb>>["data"]
> {
  const response = await fetch(`${API_URL}users/${userAddress}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
