import { API_URL } from "../constants"

export async function userEmailPreferencesUpdate(emailPreferences: any) {
    if (!emailPreferences) throw new Error("No email preferences provided")
    const response = await fetch(`${API_URL}/email-preferences/profile`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(emailPreferences),
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
