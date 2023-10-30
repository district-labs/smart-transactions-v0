import { API_URL } from "../constants"

export type StrategyUserActiveFindFilters = {
    filters: {
        root: string
    }
}

export async function strategyUserActiveFind({filters}: StrategyUserActiveFindFilters) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/strategy/active?${params.toString()}`, {
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
