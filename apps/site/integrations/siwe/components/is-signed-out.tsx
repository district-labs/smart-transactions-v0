"use client"

import { useUser } from "@/hooks/use-user"
import { ReactNode } from "react"


interface IsSignedOutProps {
  children: ReactNode
}

export const IsSignedOut = ({ children }: IsSignedOutProps) => {
  const { user } = useUser()

  if (!user?.isLoggedIn) return <>{children}</>

  return null
}
