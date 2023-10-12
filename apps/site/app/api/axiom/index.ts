import { env } from "@/env.mjs"
import { Axiom, type AxiomConfig } from "@axiom-crypto/core"

export const UNI_V3_POOL_ADDR = "0x5c33044BdBbE55dAb3d526CE70F908aAF6990373"
export const START_BLOCK = 9798709
export const END_BLOCK = 9802115

const PROVIDER_URI = `https://eth-goerli.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_ID}`

export const chainId = 5

export const axiomConfig: AxiomConfig = {
  providerUri: PROVIDER_URI,
  version: "v1",
  chainId,
  // Mock proofs enabled for Goerli only
  mock: true,
}
export const ax = new Axiom(axiomConfig)
