import { createPublicClient, http, type Address } from "viem"
import { goerli } from "viem/chains"

export const SUPPORTED_CHAINS = [5, 31337]
export const MULTICALL_WITH_FLASHLOAN_ADDRESS =
  "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb"
export const INTENTIFY_API_URL = "http://localhost:3002"

export function getSearcherAddressBychainId(chainId: number): Address {
  switch (chainId) {
    case 5: {
      return "0xf84B4AbfcC1E062aa54D738f2ABE00c1B85090DF"
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
