import { useGetSafeAddress } from "@district-labs/intentify-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ApiIntentBatch } from "@/lib/validations/api/intent-batch"

export function useIntentBatchCreate() {
  const queryClient = useQueryClient()
  const address = useGetSafeAddress()

  const mutationFn = async (intentBatch: ApiIntentBatch) => {
    if (!intentBatch) throw new Error("No intent batch provided")
    const response = await fetch("/api/intent-batch/create", {
      method: "POST",
      body: JSON.stringify(intentBatch),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data: {
        ok: true
      } = await response.json()

      return data
    }

    const data = await response.text()
    throw new Error(data)
  }

  const mutationResult = useMutation(["intent-batch-create"], {
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["intent-batch", "all", address])
    },
  })

  return mutationResult
}
