"use client"

import { IntentBatch, type TokenList } from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
    intentAaveLeverageLong,
    intentAaveLeverageLongFields,
    nonceManager,
    nonceManagerFields,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import { useImmer } from "use-immer"
import { useIntentifySafeModuleGetStandardNonce, useIntentifySafeModuleGetDimensionalNonce } from '@district-labs/intentify-core-react' 

export type StrategyLeverageLong = {
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    minHealthFactor: {
        label: string
        classNameLabel?: string
        classNameValue?: string
    }
  }
  onIntentBatchGenerated: (
    intentBatchEIP712: IntentBatch
  ) => void
  children: (props: {
    handleGenerateIntentBatch: () => Promise<void>
  }) => React.ReactNode
}

export function StrategyLeverageLong({
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
  config
}: StrategyLeverageLong) {
  const [intentBatch, setIntentBatch] = useImmer({
    ...nonceManager,
    ...intentAaveLeverageLong
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

    intentBatchManager.add("AaveLeverageLong", [
      String(intentBatch.timestampRange.minTimestamp),
      String(intentBatch.timestampRange.maxTimestamp),
    ])
    const intentBatchStruct =
      intentBatchManager.generate()
    onIntentBatchGenerated?.(intentBatchStruct)
  }

  return (
    <Card>
      <CardContent className="grid gap-6 pt-4">
        {/* ----- Nonce Manager ----- */}
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
        {/* ----- Interest Rate Mode ----- */}
        <div className=''>
          {intentAaveLeverageLongFields.InterestRateMode(
            intentBatch,
            setIntentBatch,
            {
              label: "Interest Rate Mode",
            }
          )}
        </div>
        {/* ----- Supply Token ----- */}
        <div className=''>
          {intentAaveLeverageLongFields.SupplyToken(
            intentBatch,
            setIntentBatch,
            tokenList,
            {
              label: "Supply",
            }
          )}
        </div>
        {/* ----- Borrow Token ----- */}
        <div className=''>
          {intentAaveLeverageLongFields.BorrowToken(
            intentBatch,
            setIntentBatch,
            tokenList,
            {
              label: "Borrow",
            }
          )}
        </div>
        {/* ----- Minimum Health Factor ----- */}
        <div className=''>
          {intentAaveLeverageLongFields.MinHealthFactor(
            intentBatch,
            setIntentBatch,
            config.minHealthFactor
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
