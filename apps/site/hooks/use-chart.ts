import { type CoinsInput, type Period } from "@/types"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

import { formatCoinsInput } from "@/lib/utils"

type QueryOptions = Omit<
  UseQueryOptions<
    unknown,
    unknown,
    UseChartResponse,
    (string | CoinsInput | CoinsInput[])[]
  >,
  "initialData" | "queryKey"
> & { initialData?: (() => undefined) | undefined }

interface UseChartProps extends QueryOptions {
  coins: CoinsInput[] | CoinsInput
  searchWidth?: string
  timestamp?: {
    type: "start" | "end"
    value: number
  }
  spanDataPoints?: number
  period?: Period
}

export interface UseChartResponse {
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

const DEFI_LLAMA_API_URL = "https://coins.llama.fi"
const DEFAULT_CACHE_TIME = 1000 * 60 * 5 // 5 minutes
const DEFAULT_SEARCH_WIDTH = "600"

/**
 * Fetches the token prices at regular time intervals
 */
export function useChart({
  coins,
  timestamp = {
    type: "end",
    value: Math.floor(Date.now() / 1000),
  },
  searchWidth = DEFAULT_SEARCH_WIDTH,
  spanDataPoints,
  period,
  cacheTime = DEFAULT_CACHE_TIME,
  enabled,
  ...options
}: UseChartProps) {
  if (!coins || (Array.isArray(coins) && coins.length === 0)) {
    throw new Error("Missing required 'coins' parameter")
  }

  const formattedCoins = formatCoinsInput(
    Array.isArray(coins) ? coins : [coins]
  )

  return useQuery(["defi-llama", "chart", coins], {
    queryFn: async () => {
      const url = new URL(`${DEFI_LLAMA_API_URL}/chart/${formattedCoins}`)
      const params = new URLSearchParams()

      if (searchWidth) params.append("searchWidth", searchWidth.toString())
      if (timestamp.type && timestamp.value)
        params.append(timestamp.type, timestamp.value.toString())
      if (spanDataPoints) params.append("span", spanDataPoints.toString())
      if (period) params.append("period", period.toString())

      url.search = params.toString()

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch chart")
      const data: UseChartResponse = await response.json()

      return data
    },
    enabled: !!coins && enabled,
    ...options,
  })
}
