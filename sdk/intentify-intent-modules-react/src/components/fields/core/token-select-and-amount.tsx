import { type Dispatch, type SetStateAction } from "react"
import type { Token, TokenList } from "@district-labs/intentify-core"

import { TokenSelector } from "./token-selector"

interface TokenSelectAndAmount {
  amount: number | undefined
  setAmount: Dispatch<SetStateAction<number | undefined>>
  selectedToken: Token
  setSelectedToken: (token: Token) => void
  tokenList: TokenList
}

export function TokenSelectAndAmount({
  amount,
  setAmount,
  selectedToken,
  setSelectedToken,
  tokenList,
}: TokenSelectAndAmount) {
  return (
    <div className="group relative flex items-center justify-between gap-2 rounded-md border p-2">
      <div className="flex items-center gap-x-2">
        <TokenSelector
          tokenList={tokenList}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
        />
        {selectedToken?.symbol && (
          <span className="text-sm font-medium">
            {selectedToken.name} ({selectedToken.symbol})
          </span>
        )}
      </div>
      <input
        id="amount"
        type="number"
        className="placeholder:text-muted-foreground block w-full flex-1 bg-transparent px-3 py-1 text-right text-sm text-xl font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
    </div>
  )
}
