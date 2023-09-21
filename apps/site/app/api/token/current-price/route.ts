import { z } from "zod"

import { formatCoinsInput } from "@/lib/utils"
import { getTokenCurrentPriceSchema } from "@/lib/validations/token"

interface GetTokenCurrentPriceResponse {
  coins: {
    [key: string]: {
      price: number
      symbol: string
      timestamp: number
      confidence: number
    }
  }
}

export async function POST(req: Request) {
  const input = getTokenCurrentPriceSchema.parse(await req.json())

  try {
    if (
      !input.coins ||
      (Array.isArray(input.coins) && input.coins.length === 0)
    ) {
      throw new Error("Missing required 'coins' parameters")
    }

    const formattedCoins = formatCoinsInput(
      Array.isArray(input.coins) ? input.coins : [input.coins]
    )

    const url = new URL(
      `https://coins.llama.fi/prices/current/${formattedCoins}`
    )

    const response = await fetch(url)

    if (!response.ok) throw new Error("Failed to fetch token price")

    const data = (await response.json()) as GetTokenCurrentPriceResponse

    return new Response(
      JSON.stringify(data.coins[formattedCoins].price, null, 2),
      { status: 200 }
    )
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
