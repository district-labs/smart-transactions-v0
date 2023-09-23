"use client"

import { useEffect, useState } from "react"
import { type DefiLlamaToken } from "@/types"
import { useChainId } from "wagmi"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TokenInputAmount from "@/components/blockchain/token-input-amount"
import TokenPriceChart from "@/components/charts/token-price-chart"
import { Icons } from "@/components/icons"
import { OpenOrdersTableShell } from "@/components/strategies/limit-order-table-shell"

import { useCurrentPrice } from "./use-current-price"
import { usePlaceOrder } from "./use-place-order"
import { defaultTokenIn, defaultTokenOut } from "./utils"

const dummyData = [
  {
    sell: {
      asset: "Ether",
      amount: 2,
    },
    recieve: {
      asset: "USDC",
      amount: 4000,
    },
    limitPrice: "1000",
    expiry: "October 21, 2023",
    status: "open" as const,
  },
  {
    sell: {
      asset: "Ether",
      amount: 2,
    },
    recieve: {
      asset: "USDC",
      amount: 4000,
    },
    limitPrice: "1000",
    expiry: "October 21, 2023",
    status: "open" as const,
  },
]

export default function LimitPage() {
  const chainId = useChainId()
  const [amountOut, setAmountOut] = useState<number>()
  const [amountIn, setAmountIn] = useState<number>()
  const [limitPrice, setLimitPrice] = useState<number>()
  const [expiry, setExpiry] = useState<string>("1d")
  const [tokenOut, setTokenOut] = useState<DefiLlamaToken>(defaultTokenOut)
  const [tokenIn, setTokenIn] = useState<DefiLlamaToken>(defaultTokenIn)

  // TODO: only able to fetch prices in USD
  const currentPrice = useCurrentPrice({
    token: {
      chainId: tokenOut.chainId,
      type: "erc20",
      address: tokenOut.address,
    },
  })

  const { mutationResult, isLoadingSign } = usePlaceOrder({
    chainId,
    amountIn,
    amountOut,
    expiry,
    tokenIn,
    tokenOut,
  })

  async function handlePlaceOrder() {
    await mutationResult.mutateAsync()
  }

  async function handleRefetch() {
    await currentPrice.refetch()
    setLimitPrice(currentPrice.data)
  }

  useEffect(() => {
    if (!amountOut || !limitPrice) return
    setAmountIn(amountOut / limitPrice)
  }, [amountOut, limitPrice])

  useEffect(() => {
    if (!amountIn || !limitPrice) return
    setAmountOut(amountIn * limitPrice)
  }, [amountIn])

  return (
    <>
      <section className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <h2 className="text-2xl tracking-tight sm:text-3xl">ETH/USDC</h2>
          <TokenPriceChart />
        </div>
        <Card>
          <CardContent className="grid gap-6 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="selling" className="text-muted-foreground">
                You&apos;re selling
              </Label>
              <TokenInputAmount
                amount={amountOut}
                setAmount={setAmountOut}
                selectedToken={tokenOut}
                setSelectedToken={setTokenOut}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  <span className="mr-2 text-sm font-medium">
                    {tokenOut.symbol}
                  </span>
                </div>
              </div>
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
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  <Icons.arrowdown />
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selling">To receive</Label>
              <TokenInputAmount
                amount={amountIn}
                setAmount={setAmountIn}
                selectedToken={tokenIn}
                setSelectedToken={setTokenIn}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-y-3">
            <Button
              onClick={() => handlePlaceOrder()}
              disabled={
                isLoadingSign ||
                mutationResult.isLoading ||
                !amountOut ||
                !amountIn
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
      </section>
      <section className="mt-10">
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <OpenOrdersTableShell pageCount={1} data={dummyData} />
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}
