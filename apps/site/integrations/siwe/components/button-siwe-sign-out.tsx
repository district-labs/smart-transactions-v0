"use client"

import { type HTMLAttributes } from "react"
import { signSignOut } from "@/integrations/siwe/actions/siwe-sign-out"

import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

interface ButtonSiweSignOut extends HTMLAttributes<HTMLButtonElement> {
  label?: string
  size?: any
  variant?: any
}

export const ButtonSiweSignOut = ({
  className,
  label = "Sign Out",
  size = "default",
  variant,
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
      variant={variant}
      size={size}
      className={className}
      onClick={() => void handleLogout()}
      {...props}
    >
      {children || label}
    </Button>
  )
}
