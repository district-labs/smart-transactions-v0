"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { SiweMessage } from "siwe"
import { useAccount, useNetwork, useSignMessage } from "wagmi"

import { catchError } from "@/lib/utils"

import { Button } from "../ui/button"

interface LogInButtonProps {
  onSuccessLink?: string
}

export function LogInButton({
  onSuccessLink = "/dashboard",
}: LogInButtonProps) {
  const router = useRouter()
  const [state, setState] = useState<{
    loading?: boolean
    nonce?: string
  }>({})
  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch("/api/nonce")
      const nonce = await nonceRes.text()
      setState((x) => ({ ...x, nonce }))
    } catch (err) {
      setState((x) => ({ ...x, error: err as Error }))
    }
  }

  useEffect(() => {
    fetchNonce()
  }, [])

  const { address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()

  const signIn = async () => {
    try {
      const chainId = chain?.id
      if (!address || !chainId) return

      setState((x) => ({ ...x, loading: true }))
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: state.nonce,
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      // Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error("Error verifying message")

      setState((x) => ({ ...x, loading: false }))
      router.push(onSuccessLink)
    } catch (err) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }))
      fetchNonce()
      catchError(err)
    }
  }

  return (
    <Button
      className="bg-teal-600 hover:bg-teal-600/80"
      disabled={!state.nonce || state.loading}
      onClick={signIn}
    >
      Sign-In with Ethereum
    </Button>
  )
}

export function NewUserButton() {
  const router = useRouter()
  const { isConnected } = useAccount()

  const [state, setState] = useState<{
    address?: string
    error?: Error
    loading?: boolean
  }>({})

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/user")
        const json = await res.json()
        setState((x) => ({ ...x, address: json.address }))
      } catch (_error) {}
    }
    // 1. page loads
    handler()

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler)
    return () => window.removeEventListener("focus", handler)
  }, [])

  if (isConnected) {
    return (
      <div>
        {/* Account content goes here */}

        {state.address ? (
          <div>
            <div>Signed in as {state.address}</div>
            <Button
              onClick={async () => {
                await fetch("/api/logout")
                setState({})
              }}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <LogInButton
            onSuccess={({ address }) => router.push("/onboarding")}
            onError={({ error }) => setState((x) => ({ ...x, error }))}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <ConnectButton />
    </div>
  )
}
