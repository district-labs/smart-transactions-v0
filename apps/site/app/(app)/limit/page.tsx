"use client"

import { type DefiLlamaToken } from "@/types"
import { useEffect, useRef, useState } from "react"
import { useChainId } from "wagmi"

import LimitPriceInput from "@/components/blockchain/limit-price-input"
import TokenInputAmount from "@/components/blockchain/token-input-amount"
import TokenPriceChart from "@/components/charts/token-price-chart"
import { Icons } from "@/components/icons"
import { OpenOrdersTableShell } from "@/components/strategies/limit-order-table-shell"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [amountIn, setAmountIn] = useState<number | undefined>()
  const [limitPrice, setLimitPrice] = useState<number | undefined>()
  const [expiry, setExpiry] = useState<string>("1d")
  const [tokenOut, setTokenOut] = useState<DefiLlamaToken>(defaultTokenOut)
  const [tokenIn, setTokenIn] = useState<DefiLlamaToken>(defaultTokenIn)

  const prevAmountOut = useRef<number | undefined>(amountOut)
  const prevAmountIn = useRef<number | undefined>(amountIn)

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

useEffect(() => {
  if(!limitPrice) return;

  // Only update amountIn if amountOut has changed from its previous value
  if(amountOut && (!prevAmountOut.current || amountOut !== prevAmountOut.current)) {
    setAmountIn(amountOut ? amountOut / limitPrice : 0);
    prevAmountOut.current = amountOut; // Set the current value to the ref
  }

  // Only update amountOut if amountIn has changed from its previous value
  if(amountIn && (!prevAmountIn.current || amountIn !== prevAmountIn.current)) {
    setAmountOut(amountIn ? amountIn * limitPrice : 0);
    prevAmountIn.current = amountIn; // Set the current value to the ref
  }

}, [amountOut, amountIn, limitPrice]);


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
              <LimitPriceInput
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                limitPrice={limitPrice}
                setLimitPrice={setLimitPrice}
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
