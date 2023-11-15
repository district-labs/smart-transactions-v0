import type { PutEmailPreferencesApiParams } from "@district-labs/intentify-api";
import { putEmailPreferencesDb } from "@district-labs/intentify-database";

export async function putEmailPreferencesApi(
  coreApiUrl: string,
  putEmailPreferencesParams: PutEmailPreferencesApiParams,
) {
  const response = await fetch(`${coreApiUrl}email-preferences/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(putEmailPreferencesParams),
  });

  if (response.ok) {
    const data: Awaited<ReturnType<typeof putEmailPreferencesDb>> =
      await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
