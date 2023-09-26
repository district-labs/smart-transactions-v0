"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { type DefiLlamaToken } from "@/types"
import { useChainId } from "wagmi"

import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LimitPriceInput from "@/components/blockchain/limit-price-input"
import TokenInputAmount from "@/components/blockchain/token-input-amount"
import { Icons } from "@/components/icons"
import { useCurrentPriceERC20 } from "@/app/(app)/limit/use-current-price"
import { usePlaceOrder } from "@/app/(app)/limit/use-place-order"

interface LimitOrderWidgetProps {
  outToken: DefiLlamaToken
  inToken: DefiLlamaToken
}

export default function LimitOrderWidget({
  outToken,
  inToken,
}: LimitOrderWidgetProps) {
  const router = useRouter()
  const chainId = useChainId()
  const [amountOut, setAmountOut] = useState<number | undefined>(1)
  const [amountIn, setAmountIn] = useState<number | undefined>()
  const [limitPrice, setLimitPrice] = useState<number | undefined>()
  const [expiry, setExpiry] = useState<string>("1d")

  const [delta, setDelta] = useState<number>(0)

  const prevAmountOut = useRef<number | undefined>(amountOut)
  const prevAmountIn = useRef<number | undefined>(amountIn)

  const { data: tokenOutUSD } = useCurrentPriceERC20({
    token: { chainId, address: outToken.address },
  })
  const { data: tokenInUSD } = useCurrentPriceERC20({
    token: { chainId, address: inToken.address },
  })

  const { mutationResult, isLoadingSign } = usePlaceOrder({
    chainId,
    amountIn,
    amountOut,
    expiry,
    tokenIn: inToken,
    tokenOut: outToken,
  })

  async function handlePlaceOrder() {
    await mutationResult.mutateAsync()
  }

  function handleSwapTokens() {
    router.push(`/limit/${inToken.symbol}/${outToken.symbol}`)
  }

  function handleSelectTokenIn(newTokenIn: DefiLlamaToken) {
    router.push(`/limit/${outToken.symbol}/${newTokenIn.symbol}`)
  }

  function handleSelectTokenOut(newTokenOut: DefiLlamaToken) {
    router.push(`/limit/${outToken.symbol}/${newTokenOut.symbol}`)
  }

  // Update URL if tokenOut or tokenIn changes
  useEffect(() => {
    router.push(`/limit/${outToken.symbol}/${inToken.symbol}`)
  }, [outToken, inToken, router])

  useEffect(() => {
    if (!limitPrice) return

    // Only update amountIn if amountOut has changed from its previous value
    if (
      amountOut &&
      (!prevAmountOut.current || amountOut !== prevAmountOut.current)
    ) {
      setAmountIn(amountOut ? amountOut / limitPrice : 0)
      prevAmountOut.current = amountOut // Set the current value to the ref
    }

    // Only update amountOut if amountIn has changed from its previous value
    if (
      amountIn &&
      (!prevAmountIn.current || amountIn !== prevAmountIn.current)
    ) {
      setAmountOut(amountIn ? amountIn * limitPrice : 0)
      prevAmountIn.current = amountIn // Set the current value to the ref
    }
  }, [amountOut, amountIn, limitPrice])

  return (
    <Card>
      <CardContent className="grid gap-6 pt-4">
        <div className="grid gap-2">
          <Label htmlFor="selling" className="text-muted-foreground">
            You&apos;re selling
          </Label>
          <TokenInputAmount
            amount={amountOut}
            setAmount={setAmountOut}
            selectedToken={outToken}
            setSelectedToken={(newTokenOut) =>
              handleSelectTokenOut(newTokenOut)
            }
          />
          <span className="text-xs text-muted-foreground">
            {amountOut && tokenOutUSD
              ? formatPrice(amountOut * tokenOutUSD, { notation: "standard" })
              : tokenOutUSD &&
                formatPrice(tokenOutUSD, { notation: "standard" })}
          </span>
        </div>
        <div className="grid grid-cols-2 items-start gap-4">
          <LimitPriceInput
            tokenIn={inToken}
            tokenOut={outToken}
            limitPrice={limitPrice}
            setLimitPrice={setLimitPrice}
            delta={delta}
            setDelta={setDelta}
          />
          <div className="grid gap-2">
            <Label htmlFor="selling">Expiry</Label>
            <Select onValueChange={setExpiry} value={expiry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {delta > 0.05 && (
            <div className="col-span-2 -mt-2 rounded-sm border border-amber-500 bg-amber-500/10 px-3 py-2">
              <p className="text-xs text-amber-600">
                Limit price is {delta.toFixed(2)}% higher than the market price.
                You could get a better price for your {outToken.symbol} doing a
                direct swap.
              </p>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <Button
              onClick={handleSwapTokens}
              variant={"ghost"}
              className="bg-background  px-2 text-muted-foreground"
            >
              <Icons.arrowdown />
            </Button>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="selling">To receive</Label>
          <TokenInputAmount
            amount={amountIn}
            setAmount={setAmountIn}
            selectedToken={inToken}
            setSelectedToken={(newTokenIn) => handleSelectTokenIn(newTokenIn)}
          />
          <span className="text-xs text-muted-foreground">
            {amountIn && tokenInUSD
              ? formatPrice(amountIn * tokenInUSD, { notation: "standard" })
              : tokenInUSD && formatPrice(tokenInUSD, { notation: "standard" })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-3">
        <Button
          onClick={() => handlePlaceOrder()}
          disabled={
            isLoadingSign || mutationResult.isLoading || !amountOut || !amountIn
          }
          className="w-full"
        >
          {isLoadingSign
            ? "Sign the message in your wallet"
            : mutationResult.isLoading
            ? "Placing Order..."
            : mutationResult.isSuccess
            ? "Order Placed!"
            : "Place Limit Order"}
        </Button>
        {mutationResult.isError && (
          <div className="text-sm text-red-500">
            {mutationResult?.error instanceof Error
              ? `Error: ${mutationResult?.error?.message}`
              : "An error occurred while placing your order."}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}