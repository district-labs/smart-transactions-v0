import { type GetTokenChartDataResponse } from "@/types"
import { z } from "zod"

import { formatChartData, formatCoinsInput } from "@/lib/utils"
import { getTokenChartDataSchema } from "@/lib/validations/token"

export async function POST(req: Request) {
  const input = getTokenChartDataSchema.parse(await req.json())

  try {
    if (
      !input.coins ||
      (Array.isArray(input.coins) && input.coins.length === 0)
    ) {
      throw new Error("Missing required 'coins' parameters")
    }

    if (!input.timestamp) {
      input.timestamp = {
        type: "end",
        value: Math.floor(Date.now() / 1000),
      }
    }

    let spanDataPoints: number
    let period: string
    switch (input.range) {
      case "1d":
        period = "15m"
        spanDataPoints = 96
        break
      case "7d":
        period = "1h"
        spanDataPoints = 168
        break
      case "30d":
        period = "4h"
        spanDataPoints = 182
        break
      case "90d":
        period = "24h"
        spanDataPoints = 90
        break
      case "365d":
        period = "1d"
        spanDataPoints = 365
        break
      case "1095d":
        period = "1w"
        spanDataPoints = 156
        break
      default:
        period = "4h"
        spanDataPoints = 182
    }

    const formattedCoins = formatCoinsInput(
      Array.isArray(input.coins) ? input.coins : [input.coins]
    )

    const url = new URL(`https://coins.llama.fi/chart/${formattedCoins}`)
    const params = new URLSearchParams()

    if (input.timestamp)
      params.append(input.timestamp.type, input.timestamp.value.toString())
    if (spanDataPoints) params.append("span", spanDataPoints.toString())
    if (period) params.append("period", period.toString())

    url.search = params.toString()

    const response = await fetch(url)

    if (!response.ok) throw new Error("Failed to fetch chart data")

    const data = (await response.json()) as GetTokenChartDataResponse

    let chartData

    if (Object.keys(data.coins).length > 1) {
      chartData = formatChartData(
        data,
        formattedCoins.split(",")[0],
        formattedCoins.split(",")[1]
      )
    } else {
      chartData = formatChartData(data, formattedCoins)
    }

    return new Response(JSON.stringify(chartData), { status: 200 })
  } catch (err) {
    console.error(err)

    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 })
    }

    if (err instanceof Error) {
      return new Response(err.message, { status: 500 })
    }

    return new Response("Something went wrong", { status: 500 })
  }
}
