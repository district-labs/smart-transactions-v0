"use client"

import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

type TeamGetFilters = {
  teamId: string
}

export async function teamGet({ teamId }: TeamGetFilters) {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}team/${teamId}`, {
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

export function useTeamGet(filters?: any) {
  return useQuery({
    queryKey: ["team", "get", filters],
    queryFn: () => teamGet(filters),
  })
}
