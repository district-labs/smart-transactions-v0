"use client"

import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useAccount } from "wagmi"

import { LogInButton } from "./login-button"

export default function NewUserButton() {
  const router = useRouter()
  const { isConnected, address } = useAccount()

  const getUserQuery = useQuery({
    queryKey: ["user", address],
    queryFn: () => {
      return axios.get("/api/user", {
        params: { address: address },
      })
    },
  })

  if (getUserQuery.data) {
    router.push("/login")
  }

  if (isConnected) {
    return <LogInButton onSuccessLink="/onboarding" />
  }

  return <ConnectButton />
}
