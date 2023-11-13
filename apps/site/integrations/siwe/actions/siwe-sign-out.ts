import { deleteAuthSessionApi } from "@district-labs/intentify-api-actions"

export async function signSignOut(): Promise<boolean> {
  try {
    const response = await deleteAuthSessionApi()
    return response?.ok
  } catch (error) {
    throw new Error(`Unexpected Error`)
  }
}
