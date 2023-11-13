"use client"

import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

type IntentBatchUserFindFilters = {
  filters: {
    strategyId?: string
  }
}

export async function teamsFind({ filters }: IntentBatchUserFindFilters) {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}team`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (response.ok) {
    const { data } = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await data
  }

  const data = await response.text()
  throw new Error(data)
}

export function useTeamsFind(filters?: any) {
  return useQuery({
    queryKey: ["teams", filters],
    queryFn: () => teamsFind(filters),
  })
}
