"use client"

import { useUser } from "@/hooks/use-user"

type IsSignedIn = React.HTMLAttributes<HTMLElement>

export const IsSignedIn = ({ children }: IsSignedIn) => {
  const { data: user } = useUser()
  if (user) return <>{children}</>

  return null
}
