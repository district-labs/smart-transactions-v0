import { env } from "@/env.mjs"
import { intentBatchCreate } from "@district-labs/intentify-api-actions"
import { useGetSafeAddress } from "@district-labs/intentify-core-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Calls the searcher API to execute the newly created intent batch
async function executeSearcherAPI(intentBatchHash: string) {
  await fetch(`${env.NEXT_PUBLIC_SEARCHER_API_URL}/engine/${intentBatchHash}`)
}

export function useActionIntentBatchCreate() {
  const queryClient = useQueryClient()
  const address = useGetSafeAddress()

  const mutationResult = useMutation(["intent-batch-create"], {
    mutationFn: intentBatchCreate,
    onSuccess: async ({ intentBatchHash }) => {
      await queryClient.invalidateQueries(["intent-batch", "all"])
      await queryClient.invalidateQueries(["intent-batch", "all", address])

      // Execute the searcher API with the new intent batch hash
      executeSearcherAPI(intentBatchHash)
    },
  })

  return mutationResult
}
