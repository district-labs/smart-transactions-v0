"use client"

import { HTMLAttributes } from "react"
import { siweLogout } from "@/integrations/siwe/actions/siwe-logout"

import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

interface ButtonSIWELogoutProps extends HTMLAttributes<HTMLButtonElement> {
  label?: string
}

export const ButtonSIWELogout = ({
  className,
  label = "Logout",
  children,
  ...props
}: ButtonSIWELogoutProps) => {
  const { mutateUser } = useUser()
  const handleLogout = async () => {
    await siweLogout()
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
