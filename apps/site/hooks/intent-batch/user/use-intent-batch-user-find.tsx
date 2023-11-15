"use client"

import { env } from "@/env.mjs"
import {
  getIntentBatchesApi,
  type GetIntentBatchesApiParams,
} from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

interface UseIntentBatchUserFindParams {
  filters?: GetIntentBatchesApiParams["filter"]
}

export function useIntentBatchUserFind({
  filters,
}: UseIntentBatchUserFindParams) {
  return useQuery({
    queryKey: ["intent-batch", "all", filters],
    queryFn: () =>
      getIntentBatchesApi(env.NEXT_PUBLIC_API_URL, { filter: filters, expand: {
        intents: true,
        executedTxs: true,
        strategy: true
      } }),
  })
}
