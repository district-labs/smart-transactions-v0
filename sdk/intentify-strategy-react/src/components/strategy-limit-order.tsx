"use client"

import { useEffect } from "react"
import { IntentBatch, type TokenList } from "@district-labs/intentify-core"
import {
  useIntentifySafeModuleGetDimensionalNonce,
  useIntentifySafeModuleGetStandardNonce,
} from "@district-labs/intentify-core-react"
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

  const { data: nonceStandardData, error: nonceStandardError } =
    useIntentifySafeModuleGetStandardNonce({
      address: intentifySafeModuleAddress,
      chainId: chainId,
      args: [root],
      enabled: intentBatch.nonce.type === "standard",
    })

  const { data: nonceDimensionalData, error: nonceDimensionalError } =
    useIntentifySafeModuleGetDimensionalNonce({
      address: intentifySafeModuleAddress,
      chainId: chainId,
      args: [root, intentBatch.nonce.args[0]],
      enabled: intentBatch.nonce.type === "dimensional",
    })

  useEffect(() => {
    if (
      intentBatch.nonce.type === "dimensional" &&
      config?.nonce?.dimensional?.defaultQueue
    ) {
      setIntentBatch((draft: any) => {
        draft["nonce"]["args"][0] = config?.nonce?.dimensional?.defaultQueue
      })
    }
  }, [intentBatch.nonce.type])

  const handleGenerateIntentBatch = async () => {
    if (!intentBatchFactory)
      throw new Error("Intent Batch Factory not initialized")
    if (!chainId) throw new Error("ChainId unavailable")
    const intentBatchManager = intentBatchFactory?.create(chainId, root)

    if (intentBatch.nonce.type === "standard") {
      intentBatchManager.nonce("standard", [nonceStandardData])
    }

    if (intentBatch.nonce.type === "dimensional") {
      intentBatchManager.nonce("dimensional", [
        intentBatch.nonce.args[0],
        nonceDimensionalData,
      ])
    }
    if (intentBatch.nonce.type === "time") {
      intentBatchManager.nonce("time", [
        intentBatch.nonce.args[0],
        intentBatch.nonce.args[1],
        intentBatch.nonce.args[2],
      ])
    }

    intentBatchManager.add("TimestampRange", [
      convertDateStringToEpoch(intentBatch.timestampRange.minTimestamp),
      convertDateStringToEpoch(intentBatch.timestampRange.maxTimestamp),
    ])
    intentBatchManager.add("Erc20LimitOrder", [
      intentBatch.erc20LimitOrder.tokenIn.address,
      intentBatch.erc20LimitOrder.tokenOut.address,
      intentBatch.erc20LimitOrder.amountIn,
      intentBatch.erc20LimitOrder.amountOut,
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
