"use client"

import { IntentBatch, type TokenList } from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20LimitOrder,
  intentErc20LimitOrderFields,
  intentTimestampRange,
  intentTimestampRangeFields,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import { useImmer } from "use-immer"

import { StrategyChildrenCallback } from "../types"
import { convertDateStringToEpoch, deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"
import { setIntentBatchManagerNonce } from "../set-intent-batch-nonce"
import { useDynamicNonce } from "./use-dynamic-nonce"
import { parseUnits } from "viem"

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
    config
  })

  const handleGenerateIntentBatch = async () => {
    if (!intentBatchFactory)
      throw new Error("Intent Batch Factory not initialized")
    if (!chainId) throw new Error("ChainId unavailable")
    const intentBatchManager = intentBatchFactory?.create(chainId, root)

    setIntentBatchManagerNonce(intentBatchManager, intentBatch, {
      standard: nonceData.standard,
      dimensional: nonceData.dimensional
    })

    intentBatchManager.add("TimestampRange", [
      convertDateStringToEpoch(intentBatch.timestampRange.minTimestamp).toString(),
      convertDateStringToEpoch(intentBatch.timestampRange.maxTimestamp).toString(),
    ])
    intentBatchManager.add("Erc20LimitOrder", [
      intentBatch.erc20LimitOrder.tokenIn.address,
      intentBatch.erc20LimitOrder.tokenOut.address,
      parseUnits(String(intentBatch.erc20LimitOrder.amountIn), intentBatch.erc20LimitOrder.tokenOut.decimals),
      parseUnits(String(intentBatch.erc20LimitOrder.amountOut), intentBatch.erc20LimitOrder.tokenOut.decimals)
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
