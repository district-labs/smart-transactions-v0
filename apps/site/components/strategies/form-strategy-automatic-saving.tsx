"use client"

import { useCallback, useState } from "react"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import vaultListGoerli from "@/data/lists/vault-list-testnet.json"
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
import { StrategyAutomaticSavings } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "../forms/button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "../forms/pass-form-intent-batch-state"
import { StrategyActionBar } from "../forms/strategy-action-bar"

export type FormStrategyAutomaticSaving = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
  overrideValues?: any
}

export function FormStrategyAutomaticSaving({
  strategyId,
  overrideValues,
}: FormStrategyAutomaticSaving) {
  const chainId = useChainId()
  const address = useGetSafeAddress()
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const { mutateAsync, isSuccess, isError, isLoading, error } =
    useActionIntentBatchCreate()

  const [currentValues, setCurrentValues] = useState<any>(null)
  // const defaultValues ={}
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
      <StrategyAutomaticSavings
        defaultValues={defaultValues}
        intentifySafeModuleAddress={intentifyAddress}
        root={address}
        chainId={chainId}
        vaultList={vaultListGoerli}
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
          tokenOut: {
            label: "Deposit",
            classNameLabel: "text-muted-background",
            description:
              "Token to supply to a PoolTogetherV5 Prize Savings Account",
            classNameDescription: "text-xs",
          },
          minBalance: {
            label: "Minimum Balance",
            className: "text-muted-background",
            description: "Minimum balance to maintain after deposit",
            classNameDescription: "text-xs",
          },
          balanceDelta: {
            label: "Minimum Deposit",
            className: "text-muted-background",
            description: "Minimum deposit amount",
            classNameDescription: "text-xs",
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
            className: "text-xs",
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
      </StrategyAutomaticSavings>
    </>
  )
}

export default FormStrategyAutomaticSaving
