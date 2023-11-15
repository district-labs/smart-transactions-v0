export async function deleteAuthSessionApi(coreApiUrl: string) {
  const url = new URL(`${coreApiUrl}auth/session`);

  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: { ok: boolean } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
