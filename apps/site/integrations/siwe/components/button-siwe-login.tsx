"use client"

import { HTMLAttributes } from "react"
import { siweLogin } from "@/integrations/siwe/actions/siwe-login"
import { useAccount, useNetwork, useSignMessage } from "wagmi"

import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

interface ButtonSIWELoginProps extends HTMLAttributes<HTMLButtonElement> {
  label?: string
  disabled?: boolean
}
export const ButtonSIWELogin = ({
  className,
  label = "Sign-In With Ethereum",
  disabled,
  children,
  ...props
}: ButtonSIWELoginProps) => {
  const { mutateUser } = useUser()
  const { isLoading, signMessageAsync } = useSignMessage()
  const { address } = useAccount()
  const { chain } = useNetwork()

  const handleCreateMessage = async () => {
    try {
      if (!address || !chain?.id) return
      await siweLogin({ address, chainId: chain?.id, signMessageAsync })
      await mutateUser()
    } catch (error) {
      console.error(error)
    }
  }
  const classes = cn("relative text-center", className)
  const labelClasses = cn({
    "opacity-0": isLoading,
  })

  return (
    <Button
      size="lg"
      className={classes}
      disabled={disabled}
      type="button"
      onClick={() => void handleCreateMessage()}
      {...props}
    >
      {isLoading && "Sign Message"}
      {!isLoading && (
        <span className={labelClasses}>{children || label || "Logout"}</span>
      )}
    </Button>
  )
}
