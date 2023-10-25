"use client"

import { intentBatchAdminGetAll } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function useIntentBatchAdminGetAll() {
  return useQuery({
    queryKey: ["intent-batch", "admin", "all"],
    queryFn: intentBatchAdminGetAll,
  })
}
