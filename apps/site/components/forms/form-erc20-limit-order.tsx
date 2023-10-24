"use client"

import { useCallback } from "react"
import { useActionIntentBatchCreate } from "@/actions/user/use-intent-batch-create"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import tokenListGoerli from "@/data/token-list-district-goerli.json"
import {
  generateIntentBatchEIP712,
  type IntentBatch,
} from "@district-labs/intentify-core"
import { useGetIntentifyModuleAddress } from "@district-labs/intentify-core-react"
import { IntentModule } from "@district-labs/intentify-intent-batch"
import { StrategyLimitOrder } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { useAccount, useChainId, useSignTypedData } from "wagmi"

export type FormErc20LimitOrder = React.HTMLAttributes<HTMLElement> & {
  strategyId: string
}

export function FormErc20LimitOrder({ strategyId }: FormErc20LimitOrder) {
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
    <StrategyLimitOrder
      intentifySafeModuleAddress={intentifyAddress}
      root={address}
      chainId={chainId}
      tokenList={tokenListGoerli}
      onIntentBatchGenerated={onIntentBatchGenerated}
      intentBatchFactory={intentBatchFactory}
      config={{
        minTimestamp: {
          label: "Execute After",
          className: "text-muted",
        },
        maxTimestamp: {
          label: "Execute Before",
          className: "text-muted-background",
        },
        tokenOutAndAmount: {
          label: "Sell",
          className: "text-muted-background",
        },
        tokenInAndAmount: {
          label: "Buy",
          className: "text-muted-background",
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
    </StrategyLimitOrder>
  )
}

export default FormErc20LimitOrder
