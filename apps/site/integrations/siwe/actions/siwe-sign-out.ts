import { env } from "@/env.mjs"
import { deleteAuthSessionApi } from "@district-labs/intentify-api-actions"

export async function signSignOut(): Promise<boolean> {
  try {
    const response = await deleteAuthSessionApi(env.NEXT_PUBLIC_API_URL)
    return response?.ok
  } catch (error) {
    throw new Error(`Unexpected Error`)
  }
}
