"use client"

import { intentBatchFactory } from "@/core/intent-batch-factory"
import tokenListGoerli from "@/data/token-list-district-goerli.json"
import { functionTokenListByChainId } from "@/integrations/erc20/utils/filter-token-list-by-chain-id"
import {
  generateIntentBatchEIP712,
  type IntentBatch,
} from "@district-labs/intentify-core"
import {
  useGetIntentifyModuleAddress,
  useGetSafeAddress,
} from "@district-labs/intentify-core-react"
import { type IntentModule } from "@district-labs/intentify-intent-batch"
import { StrategyLimitOrder } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "./button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "./pass-form-intent-batch-state"
import { StrategyActionBar } from "./strategy-action-bar"

export type FormStrategyLimitOrder = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
}

export function FormStrategyLimitOrder({ strategyId }: FormStrategyLimitOrder) {
  const chainId = useChainId()
  const address = useGetSafeAddress()
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const { mutateAsync, isSuccess, isError, isLoading, error } =
    useActionIntentBatchCreate()

  const [currentValues, setCurrentValues] = useState<any>(null)
  const defaultValues = useFormStrategySetDefaultValues({
    erc20LimitOrder: {
      tokenOut: tokenListGoerli.tokens[0],
      tokenIn: tokenListGoerli.tokens[1],
    },
    timestampRange: {
      minTimestamp: "2023-10-28T07:00",
      maxTimestamp: "2023-10-28T07:00",
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
    [signTypedDataAsync, chainId, intentifyAddress, mutateAsync]
  )

  if (!defaultValues) return <Loader2 size={20} className="animate-spin" />

  return (
    <>
      <StrategyActionBar
        strategyId={strategyId}
        intentBatchData={currentValues}
      />
      <StrategyLimitOrder
        defaultValues={defaultValues}
        intentifySafeModuleAddress={intentifyAddress}
        root={address}
        chainId={chainId}
        tokenList={functionTokenListByChainId(tokenListGoerli, chainId)}
        onIntentBatchGenerated={onIntentBatchGenerated}
        intentBatchFactory={intentBatchFactory}
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
          minTimestamp: {
            label: "Execute After",
            classNameLabel: "text-muted-background",
            description: "Limit order is valid after this time.",
            classNameDescription: "text-xs",
          },
          maxTimestamp: {
            label: "Execute Before",
            className: "text-muted-background",
            description: "Limit order will expire after this time.",
            classNameDescription: "text-xs",
          },
          tokenOutAndAmount: {
            label: "Sell",
            className: "text-muted-background",
            description: "Asset leaving your wallet.",
            classNameDescription: "text-xs",
          },
          tokenInAndAmount: {
            label: "Buy",
            className: "text-muted-background",
            description: "Asset entering your wallet.",
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
      </StrategyLimitOrder>
    </>
  )
}

export default FormStrategyLimitOrder
