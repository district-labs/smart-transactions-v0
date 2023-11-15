export async function getAuthNonceApi(coreApiUrl: string) {
  const url = new URL(`${coreApiUrl}auth/nonce`);
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const nonce = await response.text();
    return nonce;
  }
  const errorData = await response.text();
  throw new Error(errorData);
}
