"use client"

import { useCallback, useEffect, useState } from "react"
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
import { StrategyMeanReversion } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "./button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "./pass-form-intent-batch-state"
import { StrategyActionBar } from "./strategy-action-bar"

export type FormStrategyMeanReversion = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
}

export function FormStrategyMeanReversion({
  strategyId,
}: FormStrategyMeanReversion) {
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
      <StrategyMeanReversion
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
          tokenOutAndAmount: {
            label: "Token Out",
            className: "text-muted-background",
            description: "The token and amount to trade.",
            classNameDescription: "text-xs",
          },
          tokenIn: {
            label: "Token In",
            className: "text-muted-background",
            description: "The token to receive.",
            classNameDescription: "text-xs",
          },
          tokenAmountExpected: {
            label: "Trade Amount",
            className: "text-muted-background",
            description: "The amount of tokens to trade.",
            classNameDescription: "text-xs",
          },
          thresholdSeconds: {
            label: "Threshold Seconds",
            className: "text-muted-background",
            description: "Chainlink price feed update threshold.",
            classNameDescription: "text-xs",
          },
          isBuy: {
            label: "Swap Type",
            className: "max-w-1/3 w-1/3",
            description: "Buy or sell the token.",
            classNameDescription: "text-xs",
          },
          uniswapV3Pool: {
            label: "Uniswap V3 Pool",
            className: "text-muted-background",
            description: "Uniswap V3 Pool to measure a historical price.",
            classNameDescription: "text-xs",
          },
          numeratorTrigger: {
            classNameTrigger: "text-xs mt-3 cursor-pointer",
          },
          denominatorTrigger: {
            classNameTrigger: "text-xs mt-3 cursor-pointer",
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
      </StrategyMeanReversion>
    </>
  )
}

export default FormStrategyMeanReversion
