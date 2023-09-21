import { type CoinsInput } from "@/types"

import { calculatePeriod, formatCoinsInput } from "./utils"

interface GetTokenChartDataProps {
  coins: CoinsInput[] | CoinsInput
  searchWidth?: string
  timestamp?: {
    type: "start" | "end"
    value: number
  }
  spanDataPoints?: number
  period: `${number}m` | `${number}h` | `${number}d` | `${number}y`
}

interface GetTokenChartDataResponse {
  coins: {
    [key: string]: {
      symbol: string
      confidence: number
      decimals?: number
      prices: {
        timestamp: number
        price: number
      }[]
    }
  }
}

// TODO: make a current token price API

// TODO: MOVE TO API ROUTE FOR FUTURE API KEY
export async function getTokenChartData({
  coins,
  timestamp = {
    type: "end",
    value: Math.floor(Date.now() / 1000),
  },
  searchWidth = "600",
  spanDataPoints = 50,
  period = "30d",
}: GetTokenChartDataProps) {
  if (!coins || (Array.isArray(coins) && coins.length === 0)) {
    throw new Error("Missing required 'coins' parameters")
  }

  const formattedCoins = formatCoinsInput(
    Array.isArray(coins) ? coins : [coins]
  )

  const url = new URL(`https://coins.llama.fi/chart/${formattedCoins}`)
  const params = new URLSearchParams()

  if (searchWidth) params.append("searchWidth", searchWidth.toString())
  if (timestamp.type && timestamp.value)
    params.append(timestamp.type, timestamp.value.toString())
  if (spanDataPoints) params.append("span", spanDataPoints.toString())
  if (period)
    params.append("period", calculatePeriod(period, spanDataPoints).toString())

  url.search = params.toString()

  const response = await fetch(url)

  if (!response.ok) throw new Error("Failed to fetch chart")

  const data = (await response.json()) as GetTokenChartDataResponse

  return data.coins[formattedCoins].prices
}
