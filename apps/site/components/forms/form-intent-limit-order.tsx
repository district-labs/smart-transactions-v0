"use client"

import { useEffect, useState } from "react"
import { useAccount, useChainId, useSignTypedData } from "wagmi"

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
import TokenInputAmount from "@/components/blockchain/token-input-amount"
import { useTransformLimitOrderIntentFormToApiIntentBatch } from "@/hooks/intent-batch/use-transform-limit-order-intent-form-to-api-intent-batch"
import { useTransformLimitOrderIntentFormToStructIntentBatch } from "@/hooks/intent-batch/use-transform-limit-order-intent-form-to-struct-intent-batch"
import { getIntentBatchTypedDataHash, generateIntentBatchEIP712 } from "@district-labs/intentify-utils"
import { useGetIntentifyModuleAddress, useIntentifySafeModuleDomainSeparator } from "@district-labs/intentify-react"
import { useIntentBatchCreate } from "@/hooks/intent-batch/use-intent-batch-create"
import type { Token, TokenList } from "@/types/token-list"

import tokenListGoerli from '@/data/token-list-district-goerli.json'
const tokenListDistrictGoerli: TokenList = tokenListGoerli

export default function FormIntentLimitOrder() {
  const account = useAccount()
  const chainId = useChainId()
  const [amountOut, setAmountOut] = useState<number | undefined>(1)
  const [amountIn, setAmountIn] = useState<number | undefined>()
  const [expiry, setExpiry] = useState<string>("1d")

  const [ outToken, setOutToken ] = useState<Token>(tokenListDistrictGoerli.tokens[0])
  const [ inToken, setInToken ] = useState<Token>(tokenListDistrictGoerli.tokens[1])

  function handleSwapTokens() {
    setOutToken(inToken)
    setInToken(outToken)
  }

  function handleSelectTokenIn(newTokenIn: Token) {
    setInToken(newTokenIn)
  }

  function handleSelectTokenOut(newTokenOut: Token) {
    setOutToken(newTokenOut)
  }

  // --------------------------------------------------------
  // Construct Intent for API
  // --------------------------------------------------------

  const structIntentBatch = useTransformLimitOrderIntentFormToStructIntentBatch({
    chainId,
    amountIn,
    amountOut,
    expiry,
    tokenIn: inToken,
    tokenOut: outToken,
  })
  const intentifyModuleAddress = useGetIntentifyModuleAddress(chainId)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const {data: domainSeparator} = useIntentifySafeModuleDomainSeparator({
    address: intentifyModuleAddress,
    chainId,
  })
  const intentBatchHash = getIntentBatchTypedDataHash(domainSeparator, structIntentBatch)
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const intentBatchEIP712 = generateIntentBatchEIP712({
    chainId: chainId,
    verifyingContract: intentifyAddress,
    intentBatch: structIntentBatch,
  })
  const { isLoading: isLoadingSign, signTypedData, data:signature } = useSignTypedData(intentBatchEIP712)
  const apiIntentBatch = useTransformLimitOrderIntentFormToApiIntentBatch({
    userId: account.address ,
    chainId,
    amountIn,
    amountOut,
    expiry,
    tokenIn: inToken,
    tokenOut: outToken,
    signature: signature,
    intentBatchHash: intentBatchHash,
    domainSeparator: domainSeparator,
  })
  const { mutateAsync, isSuccess, isError, isLoading, error } = useIntentBatchCreate()

  useEffect( () => { 
      if(!apiIntentBatch) return
      if(isSuccess) return
      if(isError) return
      mutateAsync(apiIntentBatch)
  }, [apiIntentBatch, signature, isSuccess, isError, mutateAsync])


  return (
    <Card>
      <CardContent className="grid gap-6 pt-4">
        <div className="grid gap-2">
          <Label htmlFor="selling" className="text-muted-foreground">
            You&apos;re selling
          </Label>
          <TokenInputAmount
            tokenList={tokenListDistrictGoerli}
            amount={amountOut}
            setAmount={setAmountOut}
            selectedToken={outToken}
            setSelectedToken={(newTokenOut) =>
              handleSelectTokenOut(newTokenOut)
            }
          />
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-up-down"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
            </Button>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="selling">To receive</Label>
          <TokenInputAmount
            tokenList={tokenListDistrictGoerli}
            amount={amountIn}
            setAmount={setAmountIn}
            selectedToken={inToken}
            setSelectedToken={(newTokenIn) => handleSelectTokenIn(newTokenIn)}
          />
        </div>
        <div className="grid grid-cols-1 items-start gap-4">
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
      </CardContent>
      <CardFooter className="flex flex-col gap-y-3">
        {
          isSuccess &&
          <Button className="w-full">
            Intent Saved
          </Button>
        }
        {
          !isSuccess &&
          <Button
            onClick={() => signTypedData()}
            disabled={
              isSuccess || isLoadingSign || isLoading || !amountOut || !amountIn
            }
            className="w-full"
          >
            {isLoadingSign
              ? "Sign the message in your wallet"
              : isLoading
              ? "Placing Order..."
              : isSuccess
              ? "Intent Saved"
              : "Save Intent"}
          </Button>
          } 
        {isError && (
          <div className="text-sm text-red-500">
            {error instanceof Error
              ? `Error: ${error?.message}`
              : "An error occurred while placing your order."}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
