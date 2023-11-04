import type { Token, TokenList } from "@district-labs/intentify-core"

import { TokenSelector } from "./token-selector"

interface TokenSelect {
  selectedToken: Token
  setSelectedToken: (token: Token) => void
  tokenList: TokenList
}

export function TokenSelect({
  selectedToken,
  setSelectedToken,
  tokenList,
}: TokenSelect) {
  return (
    <div className="group relative flex items-center gap-2 rounded-md border p-2">
      <TokenSelector
        tokenList={tokenList}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className=""
      />
      {selectedToken && (
        <span className="text-sm font-medium">
          {selectedToken.name} ({selectedToken.symbol})
        </span>
      )}
    </div>
  )
}
