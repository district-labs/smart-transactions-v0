"use client"

import { getStrategiesApi } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

interface UseUserActiveStrategiesParams {
  filters?: {
    intentBatchRoot?: string
  }
}

export function useUserActiveStrategies(
  {filters}: UseUserActiveStrategiesParams = {}
) {
  return useQuery({
    queryKey: ["strategy", "active", filters],
    queryFn: async () => {
     const strategies = await getStrategiesApi({
        intentBatchRoot: filters?.intentBatchRoot,
        expand: {
          intentBatches: true,
          manager: true,
        }
      })

      // Filter out strategies that have no intent batches
      const activeStrategies = strategies.filter((strategy)=> strategy.intentBatches.length > 0)

      return activeStrategies
    }
  })
}
