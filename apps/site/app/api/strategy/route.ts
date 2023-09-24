import { db } from "@/db"
import { strategies } from "@/db/schema"
import { like } from "drizzle-orm"
import { type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")
  if (!query || query.length === 0) {
    return new Response("Missing required 'query' parameter", { status: 422 })
  }

  const filteredStrategies = await db
    .select({
      id: strategies.id,
      name: strategies.name,
      category: strategies.category,
    })
    .from(strategies)
    .where(like(strategies.name, `%${query}%`))
    .limit(10)

  const strategiesByCategory = Object.values(
    strategies.category.enumValues
  ).map((category) => ({
    category,
    strategies: filteredStrategies.filter(
      (strategy) => strategy.category === category
    ),
  }))

  return new Response(JSON.stringify(strategiesByCategory), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
