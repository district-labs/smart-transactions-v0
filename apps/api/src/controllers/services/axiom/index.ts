import { Axiom } from "@axiom-crypto/core"
export { getQueryResult } from "./get-query-result"
export { axiomSendQuery } from "./send-query"

function getRprUrl(chainId: number) {
  switch (chainId) {
    case 1:
      return process.env.GOERLI_RPC_URL as string
    case 5:
      return process.env.MAINNET_RPC_URL as string
    default:
      throw new Error("Unsupported chainId")
  }
}

export function getAxiom(chainId: number) {
  return new Axiom({
    providerUri: getRprUrl(chainId),
    version: "v1",
    chainId,
    // Mock proofs enabled for Goerli only
    mock: chainId === 5,
  })
}
