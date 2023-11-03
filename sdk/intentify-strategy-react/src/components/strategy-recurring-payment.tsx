"use client"

import { IntentBatch, type TokenList } from "@district-labs/intentify-core"
import { IntentBatchFactory } from "@district-labs/intentify-intent-batch"
import {
  intentErc20Transfer,
  intentErc20TransferFields,
  nonceManager,
} from "@district-labs/intentify-intent-modules-react"
import { Card, CardContent, CardFooter } from "@district-labs/ui-react"
import { useImmer } from "use-immer"

import { StrategyChildrenCallback } from "../types"
import { deepMerge } from "../utils"
import { NonceManager, type NonceConfig } from "./nonce-manager"
import { setIntentBatchManagerNonce } from "../set-intent-batch-nonce"
import { useDynamicNonce } from "./use-dynamic-nonce"
import { parseUnits } from "viem"

export type StrategyRecurringPayment = {
  defaultValues: any
  intentifySafeModuleAddress?: `0x${string}`
  root?: `0x${string}`
  chainId?: number
  tokenList: TokenList
  intentBatchFactory?: IntentBatchFactory
  config: {
    nonce?: NonceConfig
    tokenOutAndAmount: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
    to: {
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

export function StrategyRecurringPayment({
  config,
  defaultValues,
  children,
  intentifySafeModuleAddress,
  root,
  chainId,
  tokenList,
  intentBatchFactory,
  onIntentBatchGenerated,
}: StrategyRecurringPayment) {
  const startingState = deepMerge(
    {
      ...nonceManager,
      ...intentErc20Transfer,
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

    intentBatchManager.add("Erc20Transfer", [
      intentBatch.erc20Transfer.tokenOut.address,
      parseUnits(String(intentBatch.erc20Transfer.amountOut), intentBatch.erc20Transfer.tokenOut.decimals),
      intentBatch.erc20Transfer.to,
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
          {intentErc20TransferFields.tokenOutAndAmount(
            intentBatch,
            setIntentBatch,
            tokenList,
            config?.tokenOutAndAmount
          )}
        </div>
        <div className="">
          {intentErc20TransferFields.to(
            intentBatch,
            setIntentBatch,
            config?.to
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