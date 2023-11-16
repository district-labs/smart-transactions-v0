"use client"

import { env } from "@/env.mjs"
import { getIntentBatchesApi } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function useIntentBatchAdminGetAll() {
  return useQuery({
    queryKey: ["intent-batch", "admin", "all"],
    queryFn: async () => {
      const intentBatches = await getIntentBatchesApi(env.NEXT_PUBLIC_API_URL, {
        expand: {
          intents: true,
        },
      })

      return intentBatches
    },
  })
}
