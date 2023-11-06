"use client"

import { useEffect, useState } from "react"
import {
  IntentBatch,
  Token,
  type TokenList,
} from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20SwapSpotPriceBalanceTokenOut,
  intentErc20SwapSpotPriceBalanceTokenOutFields,
  intentTimestampRange,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import {
  Card,
  CardContent,
  CardFooter,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@district-labs/ui-react"
import numeral from "numeral"
import { useImmer } from "use-immer"
import { parseUnits } from "viem"

import { setIntentBatchManagerNonce } from "../set-intent-batch-nonce"
import { StrategyChildrenCallback } from "../types"
import { deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"
import { NonceStatement } from "./nonce-statement"
import { useDynamicNonce } from "./use-dynamic-nonce"

export type StrategyAutomaticLiquidate = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
    intentContainerStatement: {
      className: string
      label: string
    }
    intentStatement: {
      className: string
      label: string
    }
    nonceStatement: {
      className: string
      label: string
    }
    tokenOut: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    tokenIn: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    chainlinkTrigger: {
      labelTrigger: string
      classNameTrigger: string
    }
    tokenOutPriceFeed: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    tokenInPriceFeed: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    thresholdSeconds: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    minBalance: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    balanceDelta: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  }
  onIntentBatchGenerated: (intentBatchEIP712: IntentBatch) => void
  children: (props: StrategyChildrenCallback) => React.ReactNode
}

export function StrategyAutomaticLiquidate({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyAutomaticLiquidate) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentTimestampRange,
      ...intentErc20SwapSpotPriceBalanceTokenOut,
    },
    defaultValues
  )

  const [intentBatch, setIntentBatch] = useImmer(startingState)

  const nonceData = useDynamicNonce({
    address: intentifySafeModuleAddress,
    chainId,
    intentBatch,
    root,
    setIntentBatch,
    config,
  })

  const handleGenerateIntentBatch = async () => {
    if (!intentBatchFactory)
      throw new Error("Intent Batch Factory not initialized")
    if (!chainId) throw new Error("ChainId unavailable")
    const intentBatchManager = intentBatchFactory?.create(chainId, root)

    setIntentBatchManagerNonce(intentBatchManager, intentBatch, {
      standard: nonceData.standard,
      dimensional: nonceData.dimensional,
    })

    intentBatchManager.add("Erc20SwapSpotPriceBalanceTokenOut", [
      intentBatch.erc20SwapSpotPriceBalanceTokenOut.tokenOut.address,
      intentBatch.erc20SwapSpotPriceBalanceTokenOut.tokenIn.address,
      intentBatch.erc20SwapSpotPriceBalanceTokenOut.tokenOutPriceFeed,
      intentBatch.erc20SwapSpotPriceBalanceTokenOut.tokenInPriceFeed,
      intentBatch.erc20SwapSpotPriceBalanceTokenOut.thresholdSeconds,
      parseUnits(
        String(intentBatch.erc20SwapSpotPriceBalanceTokenOut.minBalance),
        intentBatch.erc20SwapSpotPriceBalanceTokenOut.tokenOut.decimals
      ),
      parseUnits(
        String(intentBatch.erc20SwapSpotPriceBalanceTokenOut.balanceDelta),
        intentBatch.erc20SwapSpotPriceBalanceTokenOut.tokenOut.decimals
      ),
    ])
    const intentBatchStruct = intentBatchManager.generate()
    onIntentBatchGenerated?.(intentBatchStruct)
  }
  return (
    <Card>
      <CardContent className="grid gap-6 pt-4">
        <NonceManager
          intentBatch={intentBatch}
          setIntentBatch={setIntentBatch}
          nonceConfig={config?.nonce}
        />
        <div className="">
          {intentErc20SwapSpotPriceBalanceTokenOutFields.TokenOut(
            intentBatch,
            setIntentBatch,
            tokenList,
            config?.tokenOut
          )}
        </div>
        <div className="">
          {intentErc20SwapSpotPriceBalanceTokenOutFields.TokenIn(
            intentBatch,
            setIntentBatch,
            tokenList,
            config?.tokenIn
          )}
        </div>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <span className={config?.chainlinkTrigger?.classNameTrigger}>
              {config?.chainlinkTrigger?.labelTrigger || "Advanced Settings"}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="grid gap-6 pt-4">
            {intentErc20SwapSpotPriceBalanceTokenOutFields.TokenOutPriceFeed(
              intentBatch,
              setIntentBatch,
              config?.tokenOutPriceFeed
            )}
            {intentErc20SwapSpotPriceBalanceTokenOutFields.TokenInPriceFeed(
              intentBatch,
              setIntentBatch,
              config?.tokenInPriceFeed
            )}
            {intentErc20SwapSpotPriceBalanceTokenOutFields.ThresholdSeconds(
              intentBatch,
              setIntentBatch,
              config?.thresholdSeconds
            )}
          </CollapsibleContent>
        </Collapsible>
        <div className="grid grid-cols-2 gap-x-4">
          {intentErc20SwapSpotPriceBalanceTokenOutFields.BalanceDelta(
            intentBatch,
            setIntentBatch,
            config?.balanceDelta
          )}
          {intentErc20SwapSpotPriceBalanceTokenOutFields.MinBalance(
            intentBatch,
            setIntentBatch,
            config?.minBalance
          )}
        </div>

        <div className={config?.intentContainerStatement?.className}>
          <NonceStatement
            className={config?.nonceStatement?.className}
            nonce={intentBatch.nonce}
          />
          <IntentStatement
            className={config?.intentStatement?.className}
            tokenOut={intentBatch?.erc20SwapSpotPriceBalanceTokenOut?.tokenOut}
            tokenIn={intentBatch?.erc20SwapSpotPriceBalanceTokenOut?.tokenIn}
            minBalance={
              intentBatch?.erc20SwapSpotPriceBalanceTokenOut?.minBalance
            }
            balanceDelta={
              intentBatch?.erc20SwapSpotPriceBalanceTokenOut?.balanceDelta
            }
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-3">
        {children({
          intentBatch,
          handleGenerateIntentBatch,
        })}
      </CardFooter>
    </Card>
  )
}

type IntentStatement = React.HTMLAttributes<HTMLElement> & {
  tokenOut: Token
  tokenIn: Token
  minBalance: string
  balanceDelta: string
}

const IntentStatement = ({
  className,
  tokenIn,
  tokenOut,
  minBalance,
  balanceDelta,
}: IntentStatement) => {
  const [formatted, setFormatted] = useState<{
    balanceDelta: string
    minBalance: string
    floor: string
  }>()
  useEffect(() => {
    if (minBalance && balanceDelta) {
      setFormatted({
        balanceDelta: numeral(balanceDelta).format("0,0"),
        minBalance: numeral(minBalance).format("0,0"),
        floor: numeral(BigInt(minBalance) + BigInt(balanceDelta)).format("0,0"),
      })
    }
  }, [minBalance, balanceDelta])

  if (!tokenOut || !tokenIn || !minBalance || !balanceDelta)
    return (
      <div className={className}>
        <p className="">
          Please fill out the form to generate an intent statement.
        </p>
      </div>
    )

  return (
    <div className={className}>
      Automatically swap{" "}
      <span className="font-bold">
        {formatted?.balanceDelta}+ {tokenOut?.symbol}{" "}
        <span className="font-normal">for</span> ${tokenIn?.symbol}
      </span>{" "}
      when you account contains{" "}
      <span className="font-bold">
        {formatted?.floor}+ ${tokenOut?.symbol}.
      </span>
    </div>
  )
}
