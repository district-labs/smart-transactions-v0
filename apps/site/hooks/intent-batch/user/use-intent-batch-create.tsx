import { intentBatchFactory } from "@/core/intent-batch-factory"
import { env } from "@/env.mjs"
import {
  executeIntentBatchSearcherApi,
  postIntentBatchApi,
} from "@district-labs/intentify-api-actions"
import {
  generateIntentBatchEIP712,
  type IntentBatch,
} from "@district-labs/intentify-core"
import { useGetSafeAddress } from "@district-labs/intentify-core-react"
import { IntentifySafeModule } from "@district-labs/intentify-deployments"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { hashTypedData } from "viem"

// Calls the searcher API to execute the newly created intent batch
async function executeSearcherAPI(intentBatchHash: string) {
  await executeIntentBatchSearcherApi(env.NEXT_PUBLIC_SEARCHER_API_URL, {
    intentBatchHash,
  })
}

export function useActionIntentBatchCreate() {
  const queryClient = useQueryClient()
  const safeAddress = useGetSafeAddress()

  const mutationResult = useMutation(["intent-batch-create"], {
    mutationFn: async ({
      rawIntentBatch,
      signature,
      strategyId,
      chainId,
    }: {
      rawIntentBatch: IntentBatch
      signature: string
      strategyId: string
      chainId: number
    }) => {
      // Decode the intent batch
      const decodedIntentBatch =
        intentBatchFactory.decodeIntentBatch(rawIntentBatch)

      const intentBatchHash = hashTypedData(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        generateIntentBatchEIP712({
          chainId: chainId,
          verifyingContract: IntentifySafeModule[chainId],
          intentBatch: rawIntentBatch,
        })
      )

      await postIntentBatchApi(env.NEXT_PUBLIC_API_URL, {
        intentBatch: {
          chainId,
          intentBatchHash,
          signature,
          strategyId,
          nonce: rawIntentBatch.nonce,
          root: rawIntentBatch.root,
        },
        intents: decodedIntentBatch.map(
          ({ data, intentArgs, intentId, root, target, value }) => ({
            data,
            intentArgs,
            intentId,
            root,
            target,
            value: value.toString(),
            intentBatchId: intentBatchHash,
          })
        ),
      })

      return {
        intentBatchHash,
      }
    },
    onSuccess: async (response) => {
      if (!response) return

      await queryClient.invalidateQueries(["intent-batch", "all"])
      await queryClient.invalidateQueries(["intent-batch", "all", safeAddress])

      // Execute the searcher API with the new intent batch hash
      executeSearcherAPI(response?.intentBatchHash)
    },
  })

  return mutationResult
}
