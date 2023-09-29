"use client"

import { useUser } from "@/hooks/use-user"
import { ReactNode } from "react"

interface IsSignedInProps {
  children: ReactNode
}

export const IsSignedIn = ({ children }: IsSignedInProps) => {
  const { user } = useUser()
  if (user?.isLoggedIn) return <>{children}</>

  return null
}
