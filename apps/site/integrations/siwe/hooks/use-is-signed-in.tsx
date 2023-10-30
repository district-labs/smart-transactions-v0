"use client"

import { useUser } from "@/hooks/use-user"

export const useIsSignedIn = () => {
  const { user } = useUser()
  return user?.isLoggedIn
}
