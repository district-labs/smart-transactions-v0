import type { ChangeEvent, Dispatch, SetStateAction } from "react"


import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useCurrentPriceERC20 } from "@/hooks/intent-batch/use-current-price"
import { Token } from "@/types/token-list"

interface LimitPriceInputProps {
  tokenIn: Token
  tokenOut: Token
  limitPrice: number | undefined
  setLimitPrice: Dispatch<SetStateAction<number | undefined>>
  delta: number
  setDelta: Dispatch<SetStateAction<number>>
}

export default function LimitPriceInput({
  tokenIn,
  tokenOut,
  limitPrice,
  setLimitPrice,
  delta,
  setDelta,
}: LimitPriceInputProps) {
  const { data: tokenInPrice, refetch: refetchTokenIn } = useCurrentPriceERC20({
    token: {
      address: tokenIn.address,
      chainId: tokenIn.chainId,
    },
  })

  const { data: tokenOutPrice, refetch: refetchTokenOut } =
    useCurrentPriceERC20({
      token: {
        address: tokenOut.address,
        chainId: tokenOut.chainId,
      },
    })

  async function handleRefetch() {
    await Promise.all([refetchTokenIn(), refetchTokenOut()])
    if (!tokenInPrice || !tokenOutPrice) return

    setLimitPrice(tokenInPrice / tokenOutPrice)
  }

  function handleUpdateLimitPrice(e: ChangeEvent<HTMLInputElement>) {
    const formattedLimitPrice = parseFloat(e.target.value)
    setLimitPrice(formattedLimitPrice)

    if (!tokenInPrice || !tokenOutPrice) return

    const marketPrice = tokenInPrice / tokenOutPrice
    const percDiff = (1 - formattedLimitPrice / marketPrice) * -100
    setDelta(percDiff)
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
          onChange={handleUpdateLimitPrice}
        />
        <span className="mr-2 text-sm font-medium">{tokenOut.symbol}</span>
      </div>
      {delta <= 0.05 && (
        <span
          className={cn(
            "-mt-1 text-xs text-muted-foreground",
            delta < 0 && "text-emerald-600"
          )}
        >
          {delta.toFixed(2)}%
        </span>
      )}
    </div>
  )
}
