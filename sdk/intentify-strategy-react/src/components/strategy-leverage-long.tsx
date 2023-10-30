"use client"

import { IntentBatch, type TokenList } from "@district-labs/intentify-core"

import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentAaveLeverageLong,
  intentAaveLeverageLongFields,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import { useImmer } from "use-immer"
import { parseUnits } from "viem"

import { StrategyChildrenCallback } from "../types"
import { NonceManager } from "./nonce-manager"
import { useDynamicNonce } from "./use-dynamic-nonce"
import { setIntentBatchManagerNonce } from "../set-intent-batch-nonce"
import { decimalToBigInt, deepMerge } from "../utils"

export type StrategyLeverageLong = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    supplyAsset: {
      label: string
      classNameLabel?: string
      description: string
      classNameDescription?: string
      classNameValue?: string
    }
    borrowAsset: {
      label: string
      classNameLabel?: string
      description: string
      classNameDescription?: string
      classNameValue?: string
    }
    interestRateMode: {
      label: string
      classNameLabel?: string
      description: string
      classNameDescription?: string
      classNameValue?: string
    }
    minHealthFactor: {
      label: string
      classNameLabel?: string
      description: string
      classNameDescription?: string
      classNameValue?: string
    }
    fee: {
      label: string
      classNameLabel?: string
      description: string
      classNameDescription?: string
      classNameValue?: string
    }
  }
  onIntentBatchGenerated: (intentBatchEIP712: IntentBatch) => void
  children: (props: StrategyChildrenCallback) => React.ReactNode
}

export function StrategyLeverageLong({
  children,
  config,
  defaultValues,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyLeverageLong) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentAaveLeverageLong,
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

    intentBatchManager.add("AaveLeverageLong", [
      intentBatch?.aaveLeverageLong?.supplyAsset.address,
      intentBatch?.aaveLeverageLong?.borrowAsset.address,
      intentBatch?.aaveLeverageLong?.interestRateMode,
      parseUnits(
        decimalToBigInt(
          intentBatch?.aaveLeverageLong?.minHealthFactor.toString(),
          2
        ).toString(),
        18
      ),
      decimalToBigInt(intentBatch?.aaveLeverageLong?.fee.toString(), 2),
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
        />
        {/* ----- Interest Rate Mode ----- */}
        {intentAaveLeverageLongFields.InterestRateMode(
          intentBatch,
          setIntentBatch,
          config?.interestRateMode
        )}
        {/* ----- Supply Token ----- */}
        {intentAaveLeverageLongFields.SupplyAsset(
          intentBatch,
          setIntentBatch,
          tokenList,
          config?.supplyAsset
        )}
        {/* ----- Borrow Token ----- */}
        {intentAaveLeverageLongFields.BorrowAsset(
          intentBatch,
          setIntentBatch,
          tokenList,
          config?.borrowAsset
        )}
        {/* ----- Minimum Health Factor ----- */}
        {intentAaveLeverageLongFields.MinHealthFactor(
          intentBatch,
          setIntentBatch,
          config?.minHealthFactor
        )}
        {/* ----- Fee ----- */}
        {intentAaveLeverageLongFields.Fee(
          intentBatch,
          setIntentBatch,
          config?.fee
        )}
      </CardContent>
      <CardFooter>
        {children({
          intentBatch,
          handleGenerateIntentBatch,
        })}
      </CardFooter>
    </Card>
  )
}
