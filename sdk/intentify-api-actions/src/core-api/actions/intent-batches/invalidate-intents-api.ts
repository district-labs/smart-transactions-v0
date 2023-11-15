import { API_URL } from "@/src/constants";
import { invalidateIntentsDb } from "@district-labs/intentify-database";

export async function invalidateIntentsApi(): Promise<
  ReturnType<typeof invalidateIntentsDb>
> {
  const url = new URL(`${API_URL}intent-batches`);

  url.searchParams.append("action", "invalidate");
  const response = await fetch(url, {
    method: "PATCH",
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
