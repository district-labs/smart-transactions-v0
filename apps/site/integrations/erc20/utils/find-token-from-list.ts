import type { TokenList } from "@district-labs/intentify-core"

export function findTokenFromList(
  tokenList: TokenList,
  symbol: string,
  chainId: number
) {
  const token = tokenList.tokens.find((token) => {
    return token.symbol === symbol && token.chainId === chainId
  })

  if (!token) {
    return null
    // throw new Error(`Token ${symbol} not found in token list`)
  }

  return token
}
