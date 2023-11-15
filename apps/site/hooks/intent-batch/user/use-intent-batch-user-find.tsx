"use client"

import { getIntentBatchesApi, type GetIntentBatchesApiParams } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

interface UseIntentBatchUserFindParams {
  filters?: GetIntentBatchesApiParams["filter"]
}

export function useIntentBatchUserFind({filters}: UseIntentBatchUserFindParams) {
  return useQuery({
    queryKey: ["intent-batch", "all", filters],
    queryFn: () => getIntentBatchesApi({filter: filters})
  })
}
