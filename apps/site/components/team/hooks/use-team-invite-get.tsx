"use client"

import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

type TeamInviteGetFilters = {
  teamId: string
}

export async function teamInviteGet({ teamId }: TeamInviteGetFilters) {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}team/invite/${teamId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (response.ok) {
    const { data } = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await data
  }

  const data = await response.text()
  throw new Error(data)
}

export function useTeamInviteGet(filters?: any) {
  return useQuery({
    queryKey: ["team", "invite", filters],
    queryFn: () => teamInviteGet(filters),
  })
}
