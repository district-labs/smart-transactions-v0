"use client"

import { intentBatchUserFind } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function useIntentBatchUserFind(filters?: any) {
  return useQuery({
    queryKey: ["intent-batch", "all", filters],
    queryFn: () => intentBatchUserFind(filters),
  })
}
