import { API_URL } from "../constants"

export async function userProfileGet() {
    const response = await fetch(`${API_URL}user/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
        const { data } = await response.json()
        return await data
    }

    const data = await response.text()
    throw new Error(data)
}
