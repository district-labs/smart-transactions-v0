"use client"

import { useActionIntentBatchCreate } from "@/actions/use-intent-batch-create"
import { intentBatchFactory } from "@/core/intent-batch-factory"
import tokenListGoerli from "@/data/token-list-district-goerli.json"
import {
  generateIntentBatchEIP712,
  type IntentBatch,
} from "@district-labs/intentify-core"
import { IntentModule } from "@district-labs/intentify-intent-batch"
import { useGetIntentifyModuleAddress } from "@district-labs/intentify-core-react"
import { StrategyLimitOrder } from "@district-labs/intentify-strategy-react"
import { Button } from "@district-labs/ui-react"
import { useCallback } from "react"
import { useAccount, useChainId, useSignTypedData } from "wagmi"
import { keccak256, toHex } from "viem"

export default function FormErc20LimitOrder() {
  const { address } = useAccount()
  const chainId = useChainId()
  const intentifyAddress = useGetIntentifyModuleAddress(chainId)
  const { mutateAsync, isSuccess, isError, isLoading, error } = useActionIntentBatchCreate()

  const { isLoading: isSignatureRequested, signTypedDataAsync } =
    useSignTypedData()

  const onIntentBatchGenerated = useCallback(
    async (intentBatchStruct: IntentBatch, intentBatchMetadata: IntentModule[]) => {
      console.log(intentBatchStruct, 'intentBatchStruct')
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
        strategyId: keccak256(toHex("WTF"))
      })
    }, [signTypedDataAsync, chainId, intentifyAddress, mutateAsync])
  return (
    <StrategyLimitOrder
      intentifySafeModuleAddress={intentifyAddress}
      root={address}
      chainId={chainId}
      tokenList={tokenListGoerli}
      onIntentBatchGenerated={onIntentBatchGenerated}
      intentBatchFactory={intentBatchFactory}
    >
      {({
        handleGenerateIntentBatch,
      }: {
        handleGenerateIntentBatch: () => void
      }) => (
        <>
          {isSignatureRequested && (
            <Button className="w-full">Requesting Signature</Button>
          )}
          {!isSignatureRequested && (
            <Button onClick={handleGenerateIntentBatch} className="w-full">
              Save Intent
            </Button>
          )}
        </>
      )}
    </StrategyLimitOrder>
  )
}
