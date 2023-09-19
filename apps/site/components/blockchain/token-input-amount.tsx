import { type Dispatch, type SetStateAction } from "react"
import { type Token } from "@/types"

import TokenSelector from "./token-selector"

interface TokenInputAmountProps {
  amount: number | undefined
  setAmount: Dispatch<SetStateAction<number | undefined>>
  selectedToken: Token
  setSelectedToken: Dispatch<SetStateAction<Token>>
}

export default function TokenInputAmount({
  amount,
  setAmount,
  selectedToken,
  setSelectedToken,
}: TokenInputAmountProps) {
  return (
    <div className="group relative flex items-center justify-between gap-2 rounded-md border py-1">
      <input
        id="amount"
        type="number"
        className="block w-full px-3 py-1 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <span className="text-sm font-medium">{selectedToken.symbol}</span>
      <TokenSelector
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className="mr-2"
      />
    </div>
  )
}
