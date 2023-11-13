"use client"

import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

export async function strategiesGet() {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}strategy`, {
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

export function userStrategiesGet() {
  return useQuery({
    queryKey: ["strategies", "all"],
    queryFn: () => strategiesGet(),
  })
}
