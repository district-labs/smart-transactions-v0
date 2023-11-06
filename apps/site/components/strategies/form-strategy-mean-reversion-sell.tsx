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
import { StrategyMeanReversionSell } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "../forms/button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "../forms/pass-form-intent-batch-state"
import { StrategyActionBar } from "../forms/strategy-action-bar"

export type FormStrategyMeanReversionSell =
  React.HTMLAttributes<HTMLElement> & {
    strategyId: string
    overrideValues?: any
  }

export function FormStrategyMeanReversionSell({
  strategyId,
  overrideValues,
}: FormStrategyMeanReversionSell) {
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
      <StrategyMeanReversionSell
        intentifySafeModuleAddress={intentifyAddress}
        root={address}
        chainId={chainId}
        tokenList={functionTokenListByChainId(tokenListGoerli, chainId)}
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
          tokenOutAmount: {
            label: "Sell",
            className: "text-muted-background",
            description: "The token and amount to trade.",
            classNameDescription: "text-xs",
          },
          tokenIn: {
            label: "Buy",
            className: "text-muted-background",
            description: "The token to receive.",
            classNameDescription: "text-xs",
          },
          thresholdSeconds: {
            label: "Threshold Seconds",
            className: "text-muted-background",
            description: "Chainlink price feed update threshold.",
            classNameDescription: "text-xs",
          },
          chainlinkTrigger: {
            classNameTrigger:
              "text-xs bg-neutral-100 px-2 py-1 w-full text-center cursor-pointer rounded-lg shadow-sm",
          },
          tokenOutPriceFeed: {
            label: "Token In Chainlink Price Feed",
            className: "text-muted-background",
            description: "Chainlink price feed to measure a historical price.",
            classNameDescription: "text-xs",
          },
          tokenInPriceFeed: {
            label: "Token In Chainlink Price Feed",
            className: "text-muted-background",
            description: "Chainlink price feed to measure a historical price.",
            classNameDescription: "text-xs",
          },
          uniswapV3Pool: {
            label: "Uniswap V3 Pool",
            className: "text-muted-background",
            description: "Uniswap V3 Pool to measure a historical price.",
            classNameDescription: "text-xs",
          },
          numeratorTrigger: {
            classNameTrigger:
              "text-xs bg-neutral-100 px-2 py-1 mt-2 w-full text-center cursor-pointer rounded-lg shadow-sm",
          },
          denominatorTrigger: {
            classNameTrigger:
              "text-xs bg-neutral-100 px-2 py-1 mt-2 w-full text-center cursor-pointer rounded-lg shadow-sm",
          },
          numeratorReferenceBlockOffset: {
            label: "Block Offset",
            className: "text-muted-background",
            description: "Number of blocks previous to the current block",
            classNameDescription: "text-xs",
          },
          numeratorBlockWindow: {
            label: "Block Window",
            className: "text-muted-background",
            description: "The number of blocks to measure.",
            classNameDescription: "text-xs",
          },
          numeratorBlockWindowTolerance: {
            label: "Window Tolerance",
            className: "text-muted-background",
            description:
              "Allowable block window tolerance for storage proof verification.",
            classNameDescription: "text-xs",
          },
          denominatorReferenceBlockOffset: {
            label: "Block Offset",
            className: "text-muted-background",
            description: "Number of blocks previous to the current block",
            classNameDescription: "text-xs",
          },
          denominatorBlockWindow: {
            label: "Block Window",
            className: "text-muted-background",
            description: "The number of blocks to measure.",
            classNameDescription: "text-xs",
          },
          denominatorBlockWindowTolerance: {
            label: "Window Tolerance",
            className: "text-muted-background",
            description:
              "Allowable block window tolerance for storage proof verification.",
            classNameDescription: "text-xs",
          },
          minPercentageDifference: {
            label: "Min Price Difference",
            className: "text-muted-background",
            description: "Maximum price difference before in range.",
            classNameDescription: "text-xs",
            classNameValue:
              "pl-2 ml-3 text-lg text-muted-background w-[52px] block text-right flex items-center gap-x-1",
          },
          maxPercentageDifference: {
            label: "Max Price Difference",
            className: "text-muted-background",
            description: "Maximum price difference before out of range.",
            classNameDescription: "text-xs",
            classNameValue:
              "pl-2 ml-3 text-lg text-muted-background w-[52px] block text-right flex items-center gap-x-1",
          },
          intentContainerStatement: {
            label: "Intent Statement",
            className: "bg-card-footer p-3 rounded-md shadow-xs border-dotted border-2 border-neutral-400 text-xs",
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
      </StrategyMeanReversionSell>
    </>
  )
}

export default FormStrategyMeanReversionSell
