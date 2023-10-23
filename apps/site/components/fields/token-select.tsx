import type { Token, TokenList } from "@/types/token-list"

import TokenSelector from "./token-selector"

interface TokenSelect {
  selectedToken: Token
  setSelectedToken: (token: Token) => void
  tokenList: TokenList
}

export default function TokenSelect({
  selectedToken,
  setSelectedToken,
  tokenList,
}: TokenSelect) {
  return (
    <div className="group relative flex items-center justify-between gap-2 rounded-md border p-2">
      <TokenSelector
        tokenList={tokenList}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className="mr-2"
      />
      <span className="text-sm font-medium">{selectedToken.symbol}</span>
    </div>
  )
}
