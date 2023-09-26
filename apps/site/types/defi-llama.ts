import { type Address } from "viem"

/**
 * Period representation of DefiLlama API
 * "w" = "week"
 * "d" = "day"
 * "h" = "hour"
 * "m" = "minute"
 * @example "1w" | "1d" | "1h" | "1m"
 */
export type DeFiLlamaPeriod = `${number}${"w" | "d" | "h" | "m"}`

export type DeFiLlamaCoinsInput =
  | {
      chainId: number
      type: "erc20"
      address: string
    }
  | {
      chainId: number
      type: "native"
    }

export type DeFiLlamaPriceResponse = {
  price: number
  symbol: string
  timestamp: number
  decimals?: number
  confidence: number
}

export interface DefiLlamaToken {
  name: string
  address: Address
  symbol: string
  decimals: number
  chainId: number
  logoURI: string
  tags?: string[]
  extensions?: {
    bridgeInfo?:
      | {
          [key: string]:
            | {
                tokenAddress: string
              }
            | undefined
        }
      | undefined
  }
}

export interface DefiLlamaTokenList {
  name: string
  logoURI: string
  keywords: string[]
  tags: {
    [key: string]: {
      name: string
      description: string
    }
  }
  timestamp: string
  tokens: DefiLlamaToken[]
  version: {
    major: number
    minor: number
    patch: number
  }
}

export interface GetTokenChartDataResponse {
  coins: {
    [key: string]: {
      symbol: string
      confidence: number
      decimals?: number
      prices: {
        timestamp: number
        price: number
      }[]
    }
  }
}
