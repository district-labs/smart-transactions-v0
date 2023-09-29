import { type Dispatch, type SetStateAction } from "react"

import TokenSelector from "./token-selector"
import type { Token, TokenList } from "@/types/token-list"

interface TokenInputAmountProps {
  amount: number | undefined
  setAmount: Dispatch<SetStateAction<number | undefined>>
  selectedToken: Token
  setSelectedToken: (token: Token) => void
  tokenList: TokenList
}

export default function TokenInputAmount({
  amount,
  setAmount,
  selectedToken,
  setSelectedToken,
  tokenList,
}: TokenInputAmountProps) {
  return (
    <div className="group relative flex items-center justify-between gap-2 rounded-md border py-1">
      <input
        id="amount"
        type="number"
        className="block w-full bg-transparent px-3 py-1 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      <span className="text-sm font-medium">{selectedToken.symbol}</span>
      <TokenSelector
        tokenList={tokenList}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className="mr-2"
      />
    </div>
  )
}
