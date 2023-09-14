"use server"

import { type z } from "zod"

import { type getCoinMarketChartSchema } from "@/lib/validations/gecko"

const BASE_URL = "https://api.coingecko.com/api/v3/coins"

export async function getCoinMarketChart(
  input: z.infer<typeof getCoinMarketChartSchema>
) {
  try {
    const res = await fetch(
      `${BASE_URL}/${input.coinId}/market_chart?vs_currency=${
        input.currency || "usd"
      }&days=${input.days}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch coin market chart data.")
    }

    return res.json()
  } catch (err) {
    console.log(err)
  }
}
