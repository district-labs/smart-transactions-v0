"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

interface User {
  isLoggedIn: boolean
  isRegistered: boolean
  address?: string
  isAdmin?: boolean
}

export function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
  const {
    data: user,
    refetch: mutateUser,
    ...rest
  } = useQuery<User>(["user"], {
    queryFn: () =>
      fetch(`${env.NEXT_PUBLIC_API_URL}user`, {
        credentials: "include",
      }).then((res) => res.json()),
  })

  const Router = useRouter()

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])

  return { data: user, mutateUser, ...rest }
}
