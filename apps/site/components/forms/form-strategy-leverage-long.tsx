"use client"

import { useCallback, useState } from "react"
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
import type { IntentModule } from "@district-labs/intentify-intent-batch"
import { StrategyLeverageLong } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "./button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "./pass-form-intent-batch-state"
import { StrategyActionBar } from "./strategy-action-bar"

export type FormStrategyLeverageLong = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
  overrideValues?: any
}

export function FormStrategyLeverageLong({
  strategyId,
  overrideValues,
}: FormStrategyLeverageLong) {
  const address = useGetSafeAddress()
  const chainId = useChainId()
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
    [signTypedDataAsync, chainId, intentifyAddress, mutateAsync, strategyId]
  )

  if (!defaultValues) return <Loader2 size={20} className="animate-spin" />

  return (
    <>
      <StrategyActionBar
        strategyId={strategyId}
        intentBatchData={currentValues}
      />
      <StrategyLeverageLong
        intentifySafeModuleAddress={intentifyAddress}
        root={address}
        chainId={chainId}
        tokenList={functionTokenListByChainId(tokenListGoerli, chainId)}
        onIntentBatchGenerated={onIntentBatchGenerated}
        intentBatchFactory={intentBatchFactory}
        defaultValues={defaultValues}
        config={{
          supplyAsset: {
            label: "Supply",
            classNameLabel: "text-muted-background",
            description: "Asset to supply to Aave",
            classNameDescription: "text-xs",
          },
          borrowAsset: {
            label: "Borrow",
            classNameLabel: "text-muted-background",
            description: "Asset to borrow from Aave",
            classNameDescription: "text-xs",
          },
          minHealthFactor: {
            label: "Minimum Health Factor",
            classNameLabel: "text-muted-background",
            description: "Minimum health factor to maintain during execution.",
            classNameDescription: "text-xs",
            classNameValue:
              "pl-2 text-lg text-muted-background w-[36px] block text-right",
          },
          interestRateMode: {
            label: "Interest Rate Mode",
            classNameLabel: "text-muted-background",
            description: "Select the interest rate mode for the borrow asset.",
            classNameDescription: "text-xs",
            classNameValue:
              "pl-2 text-lg text-muted-background w-[36px] block text-right",
          },
          fee: {
            label: "Execution Fee",
            description: "Fee paid to the executor of the strategy",
            classNameLabel: "text-muted-background",
            classNameDescription: "text-xs",
            classNameValue:
              "pl-2 text-lg text-muted-background w-[36px] block text-right flex items-center gap-x-1",
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
      </StrategyLeverageLong>
    </>
  )
}

export default FormStrategyLeverageLong
