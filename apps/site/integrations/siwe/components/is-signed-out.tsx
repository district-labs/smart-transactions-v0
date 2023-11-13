"use client"

import { useUser } from "@/hooks/use-user"

type IsSignedOut = React.HTMLAttributes<HTMLElement>

export const IsSignedOut = ({ children }: IsSignedOut) => {
  const { data: user } = useUser()

  if (!user) return <>{children}</>

  return null
}
