"use client"

import { useUser } from "@/hooks/use-user"

type IsSignedIn = React.HTMLAttributes<HTMLElement>

export const IsSignedIn = ({ children }: IsSignedIn) => {
  const { user } = useUser()
  if (user?.isLoggedIn) return <>{children}</>

  return null
}
