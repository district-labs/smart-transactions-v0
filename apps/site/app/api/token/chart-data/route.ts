import { type GetTokenChartDataResponse } from "@/types"
import { z } from "zod"

import {
  calculatePeriod,
  formatChartData,
  formatCoinsInput,
  formatDate,
} from "@/lib/utils"
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

    if (!input.searchWidth) {
      input.searchWidth = "600"
    }

    if (!input.spanDataPoints) {
      input.spanDataPoints = 50
    }

    if (!input.period) {
      input.period = "30d"
    }

    const formattedCoins = formatCoinsInput(
      Array.isArray(input.coins) ? input.coins : [input.coins]
    )

    const url = new URL(`https://coins.llama.fi/chart/${formattedCoins}`)
    const params = new URLSearchParams()

    if (input.searchWidth)
      params.append("searchWidth", input.searchWidth.toString())
    if (input.timestamp)
      params.append(input.timestamp.type, input.timestamp.value.toString())
    if (input.spanDataPoints)
      params.append("span", input.spanDataPoints.toString())
    if (input.period)
      params.append(
        "period",
        calculatePeriod(input.period, input.spanDataPoints).toString()
      )

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

    return new Response(JSON.stringify(chartData, null, 2), { status: 200 })
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
