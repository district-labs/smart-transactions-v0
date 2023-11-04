"use client"

import { HTMLAttributes } from "react"
import { siweSignIn } from "@/integrations/siwe/actions/siwe-sign-in"
import { Loader2 } from "lucide-react"
import { useAccount, useNetwork, useSignMessage } from "wagmi"

import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

interface ButtonSiweSignIn extends HTMLAttributes<HTMLButtonElement> {
  label?: string
  disabled?: boolean
  size?: any
  variant?: any
}
export const ButtonSiweSignIn = ({
  className,
  label = "Sign-In",
  disabled,
  size = "default",
  variant,
  children,
  ...props
}: ButtonSiweSignIn) => {
  const { mutateUser } = useUser()
  const { isLoading, signMessageAsync } = useSignMessage()
  const { address } = useAccount()
  const { chain } = useNetwork()

  const handleCreateMessage = async () => {
    try {
      if (!address || !chain?.id) return
      await siweSignIn({ address, chainId: chain?.id, signMessageAsync })
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
    variant={variant}
      size={size}
      className={classes}
      disabled={disabled}
      type="button"
      onClick={() => void handleCreateMessage()}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin " />}
      {!isLoading && (
        <span className={labelClasses}>{children || label || "Logout"}</span>
      )}
    </Button>
  )
}
