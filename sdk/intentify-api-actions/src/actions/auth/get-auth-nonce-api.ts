import { API_URL } from "@/src/constants";

export async function getAuthNonceApi(){
  const url = new URL(`${API_URL}/auth/nonce`);
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