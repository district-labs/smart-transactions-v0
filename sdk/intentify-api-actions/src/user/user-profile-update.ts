import { API_URL } from "../constants"

export async function userProfileUpdate(user: any) {
    if (!user) throw new Error("No intent batch provided")
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data: {
        ok: true
      } = await response.json()

      return data
    }

    const data = await response.text()
    throw new Error(data)
}
