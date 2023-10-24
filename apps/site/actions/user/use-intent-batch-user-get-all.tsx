"use client"

import { intentBatchUserGetAll } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function useIntentBatchUserGetAll() {
  return useQuery({
    queryKey: ["intent-batch", "all"],
    queryFn: intentBatchUserGetAll,
  })
}
