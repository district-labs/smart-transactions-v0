"use server"

import { type z } from "zod"

import { type getTokenChartDatSchema } from "@/lib/validations/llama"

const BASE_URL = "https://coins.llama.fi"

export async function getTokenChartData(
  input: z.infer<typeof getTokenChartDatSchema>
) {
  try {
    const seconds = Math.floor(Date.now() / 1000) - input.start
    let period = ""
    switch (true) {
      case seconds <= 86400:
        period = "5m"
        break
      case seconds <= 604800:
        period = "1h"
        break
      case seconds <= 2629800:
        period = "1h"
        break
      case seconds <= 7889400:
        period = "1d"
        break
      case seconds <= 31536000:
        period = "1d"
        break
      case seconds <= 94608000:
        period = "1w"
        break
      default:
        period = "1w"
    }

    const res = await fetch(
      `${BASE_URL}/${input.chain}:${input.tokenContract}?start=${input.start}&span=500&period=${period}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch token chart data.")
    }

    return res.json()
  } catch (err) {}
}
