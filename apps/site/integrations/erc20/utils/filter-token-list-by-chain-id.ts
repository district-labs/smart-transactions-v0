import type { TokenList } from "@district-labs/intentify-core"

export function functionTokenListByChainId(
  tokenList: TokenList,
  chainId: number
) {
  const _tokenList = { ...tokenList }

  _tokenList.tokens = tokenList.tokens.filter((token) => {
    return token.chainId === chainId
  })

  return _tokenList
}
