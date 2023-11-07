"use client"

import { useEffect, useState } from "react"
import {
  IntentBatch,
  Token,
  type TokenList,
} from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20LimitOrder,
  intentErc20LimitOrderFields,
  intentTimestampRange,
  intentTimestampRangeFields,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import numeral from "numeral"
import { useImmer } from "use-immer"
import { parseUnits } from "viem"

import { setIntentBatchManagerNonce } from "../set-intent-batch-nonce"
import { StrategyChildrenCallback } from "../types"
import { convertDateStringToEpoch, deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"
import { NonceStatement } from "./nonce-statement"
import TimeFromEpoch from "./shared/time-from-epoch"
import { useDynamicNonce } from "./use-dynamic-nonce"

export type StrategyLimitOrder = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
    minTimestamp: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    maxTimestamp: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    tokenOutAndAmount: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    tokenInAndAmount: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
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
  }
  onIntentBatchGenerated: (intentBatchEIP712: IntentBatch) => void
  children: (props: StrategyChildrenCallback) => React.ReactNode
}

export function StrategyLimitOrder({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyLimitOrder) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentTimestampRange,
      ...intentErc20LimitOrder,
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

    intentBatchManager.add("TimestampRange", [
      convertDateStringToEpoch(
        intentBatch.timestampRange.minTimestamp
      ).toString(),
      convertDateStringToEpoch(
        intentBatch.timestampRange.maxTimestamp
      ).toString(),
    ])
    intentBatchManager.add("Erc20LimitOrder", [
      intentBatch.erc20LimitOrder.tokenIn.address,
      intentBatch.erc20LimitOrder.tokenOut.address,
      parseUnits(
        String(intentBatch.erc20LimitOrder.amountIn),
        intentBatch.erc20LimitOrder.tokenOut.decimals
      ),
      parseUnits(
        String(intentBatch.erc20LimitOrder.amountOut),
        intentBatch.erc20LimitOrder.tokenOut.decimals
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
        <div className="grid grid-cols-2 gap-x-4">
          {intentTimestampRangeFields.minTimestamp(
            intentBatch,
            setIntentBatch,
            config?.minTimestamp
          )}
          {intentTimestampRangeFields.maxTimestamp(
            intentBatch,
            setIntentBatch,
            config?.maxTimestamp
          )}
        </div>
        <div className="">
          {intentErc20LimitOrderFields.tokenOutAndAmount(
            intentBatch,
            setIntentBatch,
            tokenList,
            config?.tokenOutAndAmount
          )}
        </div>
        <div className="">
          {intentErc20LimitOrderFields.tokenInAndAmount(
            intentBatch,
            setIntentBatch,
            tokenList,
            config?.tokenInAndAmount
          )}
        </div>
        <div className={config?.intentContainerStatement?.className}>
          <NonceStatement
            className={config?.nonceStatement?.className}
            nonce={intentBatch.nonce}
          />
          <IntentStatement
            tokenOut={intentBatch?.erc20LimitOrder?.tokenOut}
            tokenIn={intentBatch?.erc20LimitOrder?.tokenIn}
            tokenOutAmount={intentBatch?.erc20LimitOrder?.amountOut}
            tokenInAmount={intentBatch?.erc20LimitOrder?.amountIn}
            minTimestamp={intentBatch?.timestampRange?.minTimestamp}
            maxTimestamp={intentBatch?.timestampRange?.maxTimestamp}
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
  tokenOutAmount: string
  tokenInAmount: string
  minTimestamp: string
  maxTimestamp: string
}

const IntentStatement = ({
  className,
  tokenIn,
  tokenOut,
  tokenOutAmount,
  tokenInAmount,
  minTimestamp,
  maxTimestamp,
}: IntentStatement) => {
  const [formatted, setFormatted] = useState<{
    tokenInAmount: string
    tokenOutAmount: string
  }>()
  useEffect(() => {
    if (tokenOutAmount && tokenInAmount) {
      setFormatted({
        tokenOutAmount: numeral(tokenOutAmount).format("0,0"),
        tokenInAmount: numeral(tokenInAmount).format("0,0"),
      })
    }
  }, [tokenOutAmount, tokenInAmount])

  if (
    !tokenOut ||
    !tokenIn ||
    !tokenOutAmount ||
    !tokenInAmount ||
    !minTimestamp ||
    !maxTimestamp
  )
    return (
      <div className={className}>
        <p className="">
          Please fill out the form to generate an intent statement.
        </p>
      </div>
    )

  return (
    <div className={className}>
      Swap{" "}
      <span className="font-bold">
        {formatted?.tokenOutAmount} {tokenOut?.symbol}{" "}
        <span className="font-normal">for</span> {formatted?.tokenInAmount} {tokenIn?.symbol}
      </span>
      . Limit order must be executded after{" "}
      <TimeFromEpoch
        className="font-bold"
        type="DATETIME"
        length={2}
        date={minTimestamp}
      />{" "}
      and before{" "}
      <TimeFromEpoch
        className="font-bold"
        type="DATETIME"
        length={2}
        date={maxTimestamp}
      />
      .
    </div>
  )
}
