import { env } from "@/env.mjs"
import { Address } from "wagmi"
import { SignMessageArgs } from "wagmi/dist/actions"

import { siweMessage } from "./siwe-message"

interface SiweSignInProps {
  address: Address
  chainId: number
  signMessageAsync: (args?: SignMessageArgs | undefined) => Promise<Address>
}

export const siweSignIn = async ({
  address,
  chainId,
  signMessageAsync,
}: SiweSignInProps) => {
  // 1. Create and sign SIWE message
  const { message, signature } = await siweMessage({
    address,
    chainId,
    signMessageAsync,
  })

  // 2. Verify signature
  const verifyRes = await fetch(`${env.NEXT_PUBLIC_API_URL}auth/sign-in`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, signature }),
  })

  if (!verifyRes.ok) throw new Error("Error verifying message")
  if (verifyRes.status === 200) {
    dispatchEvent(new Event("verified"))
  }
}
