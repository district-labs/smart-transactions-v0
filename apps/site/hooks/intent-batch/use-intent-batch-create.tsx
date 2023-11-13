import type { ApiIntentBatch } from "@/lib/validations/api/intent-batch"
import { postIntentBatchApi } from "@district-labs/intentify-api-actions"
import { useGetSafeAddress } from "@district-labs/intentify-core-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useIntentBatchCreate() {
  const queryClient = useQueryClient()
  const address = useGetSafeAddress()

  const mutationFn = async ({intentBatch}: ApiIntentBatch) => {
    if (!intentBatch) throw new Error("No intent batch provided")
     await postIntentBatchApi(intentBatch)
    return {ok: true}
  }

  const mutationResult = useMutation(["intent-batch-create"], {
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["intent-batch", "all", address])
    },
  })

  return mutationResult
}
