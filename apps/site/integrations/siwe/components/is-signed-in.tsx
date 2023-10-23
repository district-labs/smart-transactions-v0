"use client"

import { ReactNode } from "react"

import { useUser } from "@/hooks/use-user"

interface IsSignedInProps {
  children: ReactNode
}

export const IsSignedIn = ({ children }: IsSignedInProps) => {
  const { user } = useUser()
  if (user?.isLoggedIn) return <>{children}</>

  return null
}
