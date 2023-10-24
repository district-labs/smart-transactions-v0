"use client"

import { IntentBatch, type TokenList } from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20LimitOrder,
  intentErc20LimitOrderFields,
  intentTimestampRange,
  intentTimestampRangeFields,
  nonceManager,
  nonceManagerFields,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import { useImmer } from "use-immer"
import { useIntentifySafeModuleGetStandardNonce, useIntentifySafeModuleGetDimensionalNonce } from '@district-labs/intentify-core-react' 

export type StrategyLimitOrder = {
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    minTimestamp: {
        label: string
        classNameLabel?: string
    }
    maxTimestamp: {
        label: string
        classNameLabel?: string
    }
    tokenOutAndAmount: {
        label: string
        classNameLabel?: string
    }
    tokenInAndAmount: {
        label: string
        classNameLabel?: string
    }
  }
  onIntentBatchGenerated: (
    intentBatchEIP712: IntentBatch
  ) => void
  children: (props: {
    handleGenerateIntentBatch: () => Promise<void>
  }) => React.ReactNode
}

export function StrategyLimitOrder({
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  config,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyLimitOrder) {
  const [intentBatch, setIntentBatch] = useImmer({
    ...nonceManager,
    ...intentTimestampRange,
    ...intentErc20LimitOrder,
  })

  const {data: nonceStandardData, error: nonceStandardError} = useIntentifySafeModuleGetStandardNonce({
    address: intentifySafeModuleAddress,
    chainId: chainId,
    args: [root],
    enabled: intentBatch.nonce.type === "standard",
  })
  
  const {data: nonceDimensionalData, error: nonceDimensionalError} = useIntentifySafeModuleGetDimensionalNonce({
    address: intentifySafeModuleAddress,
    chainId: chainId,
    args: [root, intentBatch.nonce.args[0]],
    enabled: intentBatch.nonce.type === "dimensional",
  })

  const handleGenerateIntentBatch = async () => {
    if (!intentBatchFactory) return
    if (!chainId) return
    const intentBatchManager = intentBatchFactory?.create(chainId, root)

    if(intentBatch.nonce.type === "standard") {
      intentBatchManager.nonce("standard", [
        nonceStandardData,
      ])
    }

    if(intentBatch.nonce.type === "dimensional") {
      intentBatchManager.nonce("dimensional", [
        intentBatch.nonce.args[0],
        nonceDimensionalData
      ])
    }
    if(intentBatch.nonce.type === "time") {
      intentBatchManager.nonce("time", [
        intentBatch.nonce.args[0],
        intentBatch.nonce.args[1],
        intentBatch.nonce.args[2],
      ])
    }

    intentBatchManager.add("TimestampRange", [
      String(intentBatch.timestampRange.minTimestamp),
      String(intentBatch.timestampRange.maxTimestamp),
    ])
    intentBatchManager.add("Erc20LimitOrder", [
      intentBatch.erc20LimitOrder.tokenIn.address,
      intentBatch.erc20LimitOrder.tokenOut.address,
      intentBatch.erc20LimitOrder.amountIn,
      intentBatch.erc20LimitOrder.amountOut,
    ])
    const intentBatchStruct =
      intentBatchManager.generate()
    onIntentBatchGenerated?.(intentBatchStruct)
  }

  return (
    <Card>
      <CardContent className="grid gap-6 pt-4">
        <div>
          {
            nonceManagerFields.NonceType(
              intentBatch,
              setIntentBatch,
            )
          }
          {
            intentBatch?.nonce.type === "dimensional" &&
            nonceManagerFields.NonceDimensional(
              setIntentBatch,
            )
          }
          {
            intentBatch?.nonce.type === "time" &&
            nonceManagerFields.NonceTime(
              setIntentBatch,
            )
          }
        </div>
        <div className='grid grid-cols-2 gap-x-4'>
          {intentTimestampRangeFields.minTimestamp(setIntentBatch, config.minTimestamp)}
          {intentTimestampRangeFields.maxTimestamp(setIntentBatch, config.maxTimestamp)}
        </div>
        <div className=''>
          {intentErc20LimitOrderFields.tokenOutAndAmount(
            intentBatch,
            setIntentBatch,
            tokenList,
            config.tokenOutAndAmount
          )}
        </div>
        <div className=''>
          {intentErc20LimitOrderFields.tokenInAndAmount(
            intentBatch,
            setIntentBatch,
            tokenList,
            config.tokenInAndAmount
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-3">
        {children({
          handleGenerateIntentBatch,
        })}
      </CardFooter>
    </Card>
  )
}
