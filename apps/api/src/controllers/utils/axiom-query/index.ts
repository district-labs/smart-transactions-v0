import { Axiom } from "@axiom-crypto/core";
import { env } from "../.../../../../env";
export * from "./abis";

function getRprUrl(chainId: number) {
  switch (chainId) {
    case 1:
      return env.GOERLI_RPC_URL as string;
    case 5:
      return env.MAINNET_RPC_URL as string;
    default:
      throw new Error("Unsupported chainId");
  }
}

export function getAxiom(chainId: number) {
  return new Axiom({
    providerUri: getRprUrl(chainId),
    version: "v1",
    chainId,
    // Mock proofs enabled for Goerli only
    mock: chainId === 5,
  });
}
