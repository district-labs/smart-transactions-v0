"use client"

import { HTMLAttributes } from "react"
import { signSignOut } from "@/integrations/siwe/actions/siwe-sign-out"

import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

interface ButtonSiweSignOut extends HTMLAttributes<HTMLButtonElement> {
  label?: string
}

export const ButtonSiweSignOut = ({
  className,
  label = "Sign Out",
  children,
  ...props
}: ButtonSiweSignOut) => {
  const { mutateUser } = useUser()
  const handleLogout = async () => {
    await signSignOut()
    await mutateUser()
  }

  return (
    <Button
      size="sm"
      className={className}
      onClick={() => void handleLogout()}
      {...props}
    >
      {children || label}
    </Button>
  )
}
