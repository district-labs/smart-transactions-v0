export async function siweLogout(): Promise<boolean> {
  try {
    await fetch("/api/logout")
    return true
  } catch (error) {
    throw new Error(`Unexpected Error`)
  }
}
