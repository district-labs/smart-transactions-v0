import type { Address } from 'viem'

export interface Token {
  chainId: number
  address: Address
  symbol: string
  name: string
  decimals: number
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

export interface TokenList {
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
  tokens: Token[]
  version: {
    major: number
    minor: number
    patch: number
  }
}