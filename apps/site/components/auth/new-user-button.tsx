"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

import { checkExistingUserAction } from "@/app/_actions/user"

import { LogInButton } from "./login-button"

export default function NewUserButton() {
  const router = useRouter()
  const { isConnected, address } = useAccount()

  const [state, setState] = useState<{
    existingUser: boolean
    error?: Error
    loading?: boolean
  }>({ existingUser: false })

  // Check for existing user when:
  useEffect(() => {
    if (!address) return

    const handler = async () => {
      try {
        const existingUser = await checkExistingUserAction(address)
        setState((x) => ({ ...x, existingUser }))
      } catch (_error) {}
    }
    // 1. page loads or address changes
    handler()
  }, [address])

  if (state.existingUser) {
    router.push("/login")
  }

  if (isConnected) {
    return <LogInButton onSuccessLink="/onboarding" />
  }

  return <ConnectButton />
}
