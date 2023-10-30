"use client"

import {
  strategyUserActiveFind,
  StrategyUserActiveFindFilters,
} from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function userStrategyUserActiveFind(
  filters: StrategyUserActiveFindFilters
) {
  return useQuery({
    queryKey: ["strategy", "active", filters],
    queryFn: () => strategyUserActiveFind(filters),
  })
}
