"use client"

import { ReactNode } from "react"
import { useAccount } from "wagmi"

import { siweLogout } from "@/integrations/siwe/actions/siwe-logout"
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
      await siweLogout()
      await mutateUser()
    },
  })


  return <>{children}</>
}

export default HandleWalletEvents
