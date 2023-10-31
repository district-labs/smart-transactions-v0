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
    <div className="group relative flex items-center justify-between gap-2 rounded-md border py-1">
      <input
        id="amount"
        type="number"
        className="placeholder:text-muted-foreground block w-full flex-1 bg-transparent px-3 py-1 text-sm font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      {selectedToken?.symbol && (
        <span className="text-sm font-medium">{selectedToken?.symbol}</span>
      )}
      <TokenSelector
        tokenList={tokenList}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className="mr-2"
      />
    </div>
  )
}