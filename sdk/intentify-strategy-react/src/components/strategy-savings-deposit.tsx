"use client"

import { useEffect } from "react"
import { IntentBatch, type VaultList } from "@district-labs/intentify-core"
import {
  useIntentifySafeModuleGetDimensionalNonce,
  useIntentifySafeModuleGetStandardNonce,
} from "@district-labs/intentify-core-react"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentPoolTogetherSavingsDeposit,
  intentPoolTogetherSavingsDepositFields,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import { useImmer } from "use-immer"

import { StrategyChildrenCallback } from "../types"
import { deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"

export type StrategySavingsDeposit = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  vaultList: VaultList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
    minThreshold: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    minDeposit: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    supplyAsset: {
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

export function StrategySavingsDeposit({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  vaultList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategySavingsDeposit) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentPoolTogetherSavingsDeposit,
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
      args: [root, intentBatch?.nonce?.args[0]],
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
        intentBatch?.nonce?.args[0],
        nonceDimensionalData,
      ])
    }
    if (intentBatch.nonce.type === "time") {
      intentBatchManager.nonce("time", [
        intentBatch?.nonce?.args[0],
        intentBatch?.nonce?.args[1],
        intentBatch?.nonce?.args[2],
      ])
    }

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
        {/* Supply Asset */}
        {intentPoolTogetherSavingsDepositFields.SupplyAsset(
          intentBatch,
          setIntentBatch,
          vaultList,
          config?.supplyAsset
        )}
        {/* Min Threshold */}
        {intentPoolTogetherSavingsDepositFields.MinThreshold(
          intentBatch,
          setIntentBatch,
          config?.minThreshold
        )}
        {/* Min Deposit */}
        {intentPoolTogetherSavingsDepositFields.MinDeposit(
          intentBatch,
          setIntentBatch,
          config?.minDeposit
        )}
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
