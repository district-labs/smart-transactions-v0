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
import { StrategyAutomaticLiquidate } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { Loader2 } from "lucide-react"
import { useChainId, useSignTypedData } from "wagmi"

import { randomBigIntInRange } from "@/lib/utils/random-big-int-range"
import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"
import { useFormStrategySetDefaultValues } from "@/hooks/strategy/use-form-strategy-set-default-values"

import { ButtonSetupSmartWalletBeforeSigningIntent } from "../forms/button-setup-smart-wallet-before-signing-intents"
import { PassFormIntentBatchState } from "../forms/pass-form-intent-batch-state"
import { StrategyActionBar } from "../forms/strategy-action-bar"

export type FormStrategyAutomaticLiquidate =
  React.HTMLAttributes<HTMLElement> & {
    strategyId: string
    overrideValues?: any
  }

export function FormStrategyAutomaticLiquidate({
  strategyId,
  overrideValues,
}: FormStrategyAutomaticLiquidate) {
  const chainId = useChainId()
  const address = useGetSafeAddress()
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const { mutateAsync, isSuccess } = useActionIntentBatchCreate()

  const [currentValues, setCurrentValues] = useState<any>(null)
  // const defaultValues ={}
  const defaultValues = useFormStrategySetDefaultValues(overrideValues)

  const { isLoading: isSignatureRequested, signTypedDataAsync } =
    useSignTypedData()

  const onIntentBatchGenerated = useCallback(
    async (intentBatchStruct: IntentBatch) => {
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
        rawIntentBatch: intentBatchStruct,
        signature,
        strategyId,
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
      <StrategyAutomaticLiquidate
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
              defaultQueue: randomBigIntInRange(
                BigInt(1),
                BigInt(100000)
              ).toString(),
            },
            time: {
              label: "Queue",
              labelTrigger: "Advanced Nonce Settings",
              classNameLabel: "text-muted-background",
              classNameTrigger:
                "text-muted-background text-xs text-center my-1 cursor-pointer",
            },
          },
          tokenOut: {
            label: "Sell",
            classNameLabel: "text-muted-background",
            description:
              "Token to supply to a PoolTogetherV5 Prize Savings Account",
            classNameDescription: "text-xs",
          },
          tokenIn: {
            label: "Buy",
            classNameLabel: "text-muted-background",
            description:
              "Token to supply to a PoolTogetherV5 Prize Savings Account",
            classNameDescription: "text-xs",
          },
          chainlinkTrigger: {
            classNameTrigger:
              "text-xs bg-card-footer px-2 py-2 w-full text-center cursor-pointer rounded-lg shadow-sm",
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
          thresholdSeconds: {
            label: "Threshold Seconds",
            className: "text-muted-background",
            description: "Chainlink price feed update threshold.",
            classNameDescription: "text-xs",
          },
          minBalance: {
            label: "Maintain Balance",
            className: "text-muted-background",
            description: "Minimum balance to maintain after swap",
            classNameDescription: "text-xs",
          },
          balanceDelta: {
            label: "Minimum Swap",
            className: "text-muted-background",
            description: "Minimum swap amount",
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
      </StrategyAutomaticLiquidate>
    </>
  )
}

export default FormStrategyAutomaticLiquidate
