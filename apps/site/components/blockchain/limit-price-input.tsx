import { type Dispatch, type SetStateAction } from "react"
import { type DefiLlamaToken } from "@/types"

import { Label } from "@/components/ui/label"
import { useCurrentPrice } from "@/app/(app)/limit/use-current-price"

interface LimitPriceInputProps {
  tokenIn: DefiLlamaToken
  tokenOut: DefiLlamaToken
  limitPrice: number | undefined
  setLimitPrice: Dispatch<SetStateAction<number | undefined>>
}

export default function LimitPriceInput({
  tokenIn,
  tokenOut,
  limitPrice,
  setLimitPrice,
}: LimitPriceInputProps) {
  const { price, refetch } = useCurrentPrice({
    tokenOut: {
      chainId: tokenOut.chainId,
      type: "erc20",
      address: tokenOut.address,
    },
    tokenIn: {
      chainId: tokenIn.chainId,
      type: "erc20",
      address: tokenIn.address,
    },
  })

  async function handleRefetch() {
    await refetch()
    setLimitPrice(price)
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-end justify-between">
        <Label htmlFor="limit" className="text-muted-foreground">
          Buy {tokenIn.symbol} for
        </Label>
        <span
          className="cursor-pointer text-xs text-muted-foreground underline"
          onClick={handleRefetch}
        >
          Use Market
        </span>
      </div>
      <div className="group relative flex items-center justify-between gap-2 rounded-md border py-1">
        <input
          id="limit"
          type="number"
          className="block w-full bg-transparent px-3 py-1 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
          placeholder="0.0"
          value={limitPrice}
          onChange={(e) => setLimitPrice(parseInt(e.target.value))}
        />
        <span className="mr-2 text-sm font-medium">{tokenOut.symbol}</span>
      </div>
    </div>
  )
}
