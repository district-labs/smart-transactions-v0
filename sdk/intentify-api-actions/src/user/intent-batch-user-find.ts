import { API_URL } from "../constants"

type IntentBatchUserFindFilters = {
    filters: {
        strategyId?: string
    }
}

export async function intentBatchUserFind({filters}: IntentBatchUserFindFilters) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}intent-batch?${params.toString()}`, {
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
