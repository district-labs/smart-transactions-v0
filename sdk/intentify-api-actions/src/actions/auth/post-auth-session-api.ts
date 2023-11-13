import { API_URL } from "@/src/constants";

interface PostAuthSessionApiParams {
  signature: string;
  message: {
    domain: string,
    address: string,
    statement?: string,
    uri: string,
    version: string,
    chainId: number,
    nonce: string,
    issuedAt: string,
  },
}

export async function postAuthSessionApi({signature, message}:PostAuthSessionApiParams){
  const url = new URL(`${API_URL}/auth/session`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({signature, message})
  });

  if (response.ok) {
    const data: {ok:boolean} = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}