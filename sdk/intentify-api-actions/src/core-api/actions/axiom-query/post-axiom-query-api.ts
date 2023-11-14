import { API_URL } from "@/src/constants";

interface PostAxiomQueryApiParams {
  chainId: number;
  queries: {
    blockNumber: number;
    address?: string;
    slot?: string;
  }[];
}

export async function postAxiomQueryApi({
  chainId,
  queries,
}: PostAxiomQueryApiParams) {
  const url = new URL(`${API_URL}/axiom-query/send-query`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chainId, queries }),
  });

  if (response.ok) {
    const data: { ok: boolean } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
