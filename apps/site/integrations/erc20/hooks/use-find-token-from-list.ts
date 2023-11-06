import { useEffect, useState } from "react"
import type { Token, TokenList } from "@district-labs/intentify-core"

import { findTokenFromList } from "../utils/find-token-from-list"

export function useFindTokenFromList(
  tokenList: TokenList,
  symbol: string,
  chainId: number
) {
  const [token, setToken] = useState<Token | null>()

  useEffect(() => {
    setToken(findTokenFromList(tokenList, symbol, chainId))
  }, [tokenList, symbol, chainId])

  return token
}
