"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { env } from "@/env.mjs"
import { getAuthUserApi } from "@district-labs/intentify-api-actions"
import { useQuery } from "@tanstack/react-query"

export function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
  const {
    data: user,
    refetch: mutateUser,
    ...rest
  } = useQuery(["user"], {
    queryFn: async function getUser() {
      const user = await getAuthUserApi(env.NEXT_PUBLIC_API_URL, {
        expand: {
          emailPreferences: true,
          strategies: true,
        },
      })

      return user
    },
  })

  const Router = useRouter()

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user)
    ) {
      Router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])

  return { data: user, mutateUser, ...rest }
}
