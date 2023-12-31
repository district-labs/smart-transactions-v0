"use client"

import { useCallback, useState } from "react"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import tokenListGoerli from "@/data/lists/token-list-testnet.json"
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
import { StrategyRecurringPayment } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "../forms/button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "../forms/pass-form-intent-batch-state"
import { StrategyActionBar } from "../forms/strategy-action-bar"
import { randomBigIntInRange } from "@/lib/utils/random-big-int-range"

export type FormStrategyRecurringPayment = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
  overrideValues?: any
}

export function FormStrategyRecurringPayment({
  strategyId,
  overrideValues,
}: FormStrategyRecurringPayment) {
  const chainId = useChainId()
  const address = useGetSafeAddress()
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const { mutateAsync, isSuccess, isError, isLoading, error } =
    useActionIntentBatchCreate()

  const [currentValues, setCurrentValues] = useState<any>(null)
  const defaultValues = useFormStrategySetDefaultValues(overrideValues)
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
      <StrategyRecurringPayment
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
              defaultQueue: randomBigIntInRange(BigInt(1), BigInt(100000)).toString(),
            },
            time: {
              label: "Queue",
              labelTrigger: "Advanced Nonce Settings",
              classNameLabel: "text-muted-background",
              classNameTrigger:
                "text-muted-background text-xs text-center my-1 cursor-pointer",
            },
          },
          intentContainerStatement: {
            label: "Intent Statement",
            className:
              "bg-card-footer p-3 rounded-md shadow-xs border-dotted border-2 border-neutral-400 text-xs",
          },
          nonceStatement: {
            label: "Intent Statement",
            className: "mb-3",
          },
          intentStatement: {
            label: "Intent Statement",
            className: "",
          },
          tokenOutAndAmount: {
            label: "Transfer",
            className: "text-muted-background",
            description: "Tokens being sent from your wallet.",
            classNameDescription: "text-xs",
          },
          to: {
            label: "To",
            className: "text-muted-background",
            description: "Account to receive the tokens.",
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
            <ButtonSetupSmartWalletBeforeSigningIntent strategyId={strategyId}>
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
      </StrategyRecurringPayment>
    </>
  )
}

export default FormStrategyRecurringPayment
