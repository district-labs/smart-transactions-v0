import { createPublicClient, http, type Address } from "viem"
import { goerli } from "viem/chains"

import { env } from "./env"

export const SUPPORTED_CHAINS = [5, 31337]
export const INTENTIFY_API_URL = "http://localhost:3002"

export function getSearcherAddressBychainId(chainId: number): Address {
  switch (chainId) {
    case 5: {
      return env.SEARCHER_ADDRESS_GOERLI
    }
    default: {
      throw new Error(`Unsupported chainId: ${chainId}`)
    }
  }
}

export const getPublicClientByChainId = (chainId: number) => {
  switch (chainId) {
    case 5: {
      return createPublicClient({
        chain: goerli,
        transport: http(),
      })
    }
    default: {
      throw new Error(`Unsupported chainId: ${chainId}`)
    }
  }
}
