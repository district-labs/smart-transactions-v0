import { env } from "@/env.mjs"

export async function signSignOut(): Promise<boolean> {
  try {
    await fetch(`${env.NEXT_PUBLIC_API_URL}auth/sign-out`, {
      credentials: "include",
    })
    return true
  } catch (error) {
    throw new Error(`Unexpected Error`)
  }
}
