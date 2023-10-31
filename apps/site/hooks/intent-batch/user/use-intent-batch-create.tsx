import { intentBatchCreate } from "@district-labs/intentify-api-actions"
import { useGetSafeAddress } from "@district-labs/intentify-core-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useActionIntentBatchCreate() {
  const queryClient = useQueryClient()
  const address = useGetSafeAddress()

  const mutationResult = useMutation(["intent-batch-create"], {
    mutationFn: intentBatchCreate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["intent-batch", "all"])
      await queryClient.invalidateQueries(["intent-batch", "all", address])
    },
  })

  return mutationResult
}
