"use client"

import { env } from "@/env.mjs"
import { getAuthUserApi } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function useUserProfileGet() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async function getUserProfile() {
      const user = await getAuthUserApi(env.NEXT_PUBLIC_API_URL, {
        expand: {
          emailPreferences: true,
        },
      })
      return user
    },
  })
}
