"use client"

import { useCallback, useEffect, useState } from "react"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import tokenListGoerli from "@/data/token-list-district-goerli.json"
import {
  generateIntentBatchEIP712,
  type IntentBatch,
} from "@district-labs/intentify-core"
import {
  useGetIntentifyModuleAddress,
  useGetSafeAddress,
} from "@district-labs/intentify-core-react"
import type { IntentModule } from "@district-labs/intentify-intent-batch"
import { StrategySavingsDeposit } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "./button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "./pass-form-intent-batch-state"
import { StrategyActionBar } from "./strategy-action-bar"

export type FormStrategySavingsDeposit = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
}

export function FormStrategySavingsDeposit({
  strategyId,
}: FormStrategySavingsDeposit) {
  const address = useGetSafeAddress()
  const chainId = useChainId()
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const { mutateAsync, isSuccess, isError, isLoading, error } =
    useActionIntentBatchCreate()

  const [currentValues, setCurrentValues] = useState<any>(null)
  const defaultValues = useFormStrategySetDefaultValues({
    aaveLeverageLong: {
      supplyAsset: tokenListGoerli.tokens[0],
      borrowAsset: tokenListGoerli.tokens[1],
    },
  })

  const { isLoading: isSignatureRequested, signTypedDataAsync } =
    useSignTypedData()

  const onIntentBatchGenerated = useCallback(
    async (
      intentBatchStruct: IntentBatch,
      intentBatchMetadata: IntentModule[]
    ) => {
      const signature = await signTypedDataAsync(
        generateIntentBatchEIP712({
          chainId: chainId,
          verifyingContract: intentifyAddress,
          intentBatch: intentBatchStruct,
        })
      )
      mutateAsync({
        chainId,
        intentBatch: intentBatchStruct,
        intentBatchMetadata,
        signature,
        strategyId: strategyId,
      })
    },
    [signTypedDataAsync, chainId, intentifyAddress, mutateAsync, strategyId]
  )

  if (!defaultValues) return <Loader2 size={20} className="animate-spin" />

  return (
    <>
      <StrategyActionBar
        strategyId={strategyId}
        intentBatchData={currentValues}
      />
      <StrategySavingsDeposit
        intentifySafeModuleAddress={intentifyAddress}
        root={address}
        chainId={chainId}
        tokenList={tokenListGoerli}
        onIntentBatchGenerated={onIntentBatchGenerated}
        intentBatchFactory={intentBatchFactory}
        defaultValues={defaultValues}
        config={{
          nonce: {
            dimensional: {
              label: "Queue",
              labelTrigger: "Advanced Nonce Settings",
              classNameLabel: "text-muted-background",
              classNameTrigger:
                "text-muted-background text-xs text-center my-1 cursor-pointer",
              defaultQueue: 1,
            },
          },
          minThreshold: {
            label: "Minimum Threshold",
            className: "text-muted-background",
            description: "Minimum amount your wallet must have.",
            classNameDescription: "text-xs",
          },
          minDeposit: {
            label: "Minimum Deposit",
            className: "text-muted-background",
            description: "Minimum amount to deposit.",
            classNameDescription: "text-xs",
          },
          supplyAsset: {
            label: "Deposit",
            className: "text-muted-background",
            description: "Asset leaving your wallet.",
            classNameDescription: "text-xs",
          },
        }}
      >
        {({
          intentBatch,
          handleGenerateIntentBatch,
        }: {
          intentBatch: any
          handleGenerateIntentBatch: () => void
        }) => (
          <>
            <PassFormIntentBatchState
              intentBatchState={intentBatch}
              setIntentBatchState={setCurrentValues}
            />
            <ButtonSetupSmartWalletBeforeSigningIntent>
              {isSuccess && <Button className="w-full">Intent Saved</Button>}
              {isSignatureRequested && (
                <Button className="w-full">Requesting Signature</Button>
              )}
              {!isSignatureRequested && !isSuccess && (
                <Button onClick={handleGenerateIntentBatch} className="w-full">
                  Sign Intent
                </Button>
              )}
            </ButtonSetupSmartWalletBeforeSigningIntent>
          </>
        )}
      </StrategySavingsDeposit>
    </>
  )
}

export default FormStrategySavingsDeposit
