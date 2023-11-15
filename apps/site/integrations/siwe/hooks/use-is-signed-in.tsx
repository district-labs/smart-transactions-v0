"use client"

import { useUser } from "@/hooks/use-user"

export const useIsSignedIn = () => {
  const { data: user } = useUser()
  return !!user?.address
}
