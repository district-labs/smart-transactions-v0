"use client"
import { useQuery } from "@tanstack/react-query"
import { intentBatchGetAll } from '@district-labs/intentify-api-actions' 

export function useIntentBatchGetAll() {
  return useQuery({
    queryKey: ["intent-batch", "all"],
    queryFn: intentBatchGetAll
  })
}
