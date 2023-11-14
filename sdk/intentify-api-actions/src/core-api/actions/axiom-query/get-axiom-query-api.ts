import { API_URL } from "@/src/constants";

interface GetAxiomQueryApiParams {
  chainId: number;
  keccakQueryResponse: string;
  queries: {
    blockNumber: number;
    address?: string;
    slot?: string;
  }[];
}

export async function getAxiomQueryApi({
  chainId,
  keccakQueryResponse,
  queries,
}: GetAxiomQueryApiParams) {
  const url = new URL(`${API_URL}/axiom-query/get-query`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chainId, keccakQueryResponse, queries }),
  });

  if (response.ok) {
    const data: { ok: boolean } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
