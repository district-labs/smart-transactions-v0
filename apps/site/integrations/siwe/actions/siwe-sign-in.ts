import { env } from "@/env.mjs"
import { postAuthSessionApi } from "@district-labs/intentify-api-actions"
import { type Address } from "wagmi"
import { type SignMessageArgs } from "wagmi/dist/actions"

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
  const verifyRes = await postAuthSessionApi(env.NEXT_PUBLIC_API_URL, {
    message,
    signature,
  })

  if (verifyRes.ok) {
    dispatchEvent(new Event("verified"))
  } else {
    throw new Error("Error verifying message")
  }
}
