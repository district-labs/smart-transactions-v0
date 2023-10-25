"use client"

import { useCallback } from "react"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import tokenListGoerli from "@/data/token-list-district-goerli.json"
import {
  generateIntentBatchEIP712,
  type IntentBatch,
} from "@district-labs/intentify-core"
import { useGetIntentifyModuleAddress } from "@district-labs/intentify-core-react"
import { IntentModule } from "@district-labs/intentify-intent-batch"
import { StrategyLeverageLong } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { useAccount, useChainId, useSignTypedData } from "wagmi"

import { useActionIntentBatchCreate } from "@/hooks/intent-batch/user/use-intent-batch-create"

console.log(StrategyLeverageLong, "StrategyLeverageLongStrategyLeverageLong")

export type FormStrategyLeverageLong = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
}

export function FormStrategyLeverageLong({
  strategyId,
}: FormStrategyLeverageLong) {
  const { address } = useAccount()
  const chainId = useChainId()
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const { mutateAsync, isSuccess, isError, isLoading, error } =
    useActionIntentBatchCreate()

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
    [signTypedDataAsync, chainId, intentifyAddress, mutateAsync]
  )
  return (
    <StrategyLeverageLong
      intentifySafeModuleAddress={intentifyAddress}
      root={address}
      chainId={chainId}
      tokenList={tokenListGoerli}
      onIntentBatchGenerated={onIntentBatchGenerated}
      intentBatchFactory={intentBatchFactory}
      config={{
        minHealthFactor: {
          label: "Minimum Health Factor",
          classNameLabel: "text-muted-background",
          classNameValue:
            "pl-2 text-lg text-muted-background w-[36px] block text-right",
        },
      }}
    >
      {({
        handleGenerateIntentBatch,
      }: {
        handleGenerateIntentBatch: () => void
      }) => (
        <>
          {isSuccess && <Button className="w-full">Intent Saved</Button>}
          {isSignatureRequested && (
            <Button className="w-full">Requesting Signature</Button>
          )}
          {!isSignatureRequested && !isSuccess && (
            <Button onClick={handleGenerateIntentBatch} className="w-full">
              Save Intent
            </Button>
          )}
        </>
      )}
    </StrategyLeverageLong>
  )
}

export default FormStrategyLeverageLong
