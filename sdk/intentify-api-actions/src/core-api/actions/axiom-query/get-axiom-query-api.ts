import type { GetAxiomQueryApiParams } from "@district-labs/intentify-api";

type axiomProof = [
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
];

export interface GetAxiomResponseResult {
  keccakBlockResponse: `0x${string}`;
  keccakAccountResponse: `0x${string}`;
  keccakStorageResponse: `0x${string}`;
  blockResponses: {
    blockNumber: number;
    blockHash: `0x${string}`;
    leafIdx: number;
    proof: axiomProof;
  }[];
  accountResponses: {
    blockNumber: number;
    addr: `0x${string}`;
    nonce: `0x${string}`;
    balance: `0x${string}`;
    storageRoot: `0x${string}`;
    codeHash: `0x${string}`;
    leafIdx: number;
    proof: axiomProof;
  }[];

  storageResponses: {
    blockNumber: number;
    addr: `0x${string}`;
    value: `0x${string}`;
    slot: number;
    leafIdx: number;
    proof: axiomProof;
  }[];
}

export async function getAxiomQueryApi(
  coreApiUrl: string,
  getAxiomQueryParams: GetAxiomQueryApiParams,
) {
  const url = new URL(`${coreApiUrl}axiom-query/get-query`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(getAxiomQueryParams),
  });

  if (response.ok) {
    const data: { data: GetAxiomResponseResult } = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}
