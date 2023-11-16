import { deleteUserDb } from "@district-labs/intentify-database";

interface DeleteUserParams {
  userAddress: string;
}

export async function deleteUserApi(
  coreApiUrl: string,
  { userAddress }: DeleteUserParams,
): Promise<Awaited<ReturnType<typeof deleteUserDb>>> {
  const response = await fetch(`${coreApiUrl}users/${userAddress}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const responseJson = await response.json();
    return responseJson;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
