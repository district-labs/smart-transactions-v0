import { API_URL } from "../constants"

export async function intentBatchAdminGetAll() {
    const response = await fetch(`${API_URL}admin/intent-batch`, {
      method: "GET",
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
