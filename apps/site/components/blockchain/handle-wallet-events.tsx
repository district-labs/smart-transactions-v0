"use client"

import { type ReactNode } from "react"
import { signSignOut } from "@/integrations/siwe/actions/siwe-sign-out"
import { useAccount } from "wagmi"

import { useUser } from "@/hooks/use-user"

interface HandleWalletEventsProps {
  children: ReactNode
}

export const HandleWalletEvents = ({ children }: HandleWalletEventsProps) => {
  const { mutateUser } = useUser()
  useAccount({
    async onConnect() {
      await mutateUser()
    },
    async onDisconnect() {
      await signSignOut()
      await mutateUser()
    },
  })

  return <>{children}</>
}

export default HandleWalletEvents
