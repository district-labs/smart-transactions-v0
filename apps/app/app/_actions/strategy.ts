"use server"

import { db } from "@/db"
import { strategies } from "@/db/schema"
import { desc, like } from "drizzle-orm"

export async function filterStrategiesAction(query: string) {
  if (query.length === 0) return null

  const filteredStrategies = await db
    .select({
      id: strategies.id,
      name: strategies.name,
      category: strategies.category,
    })
    .from(strategies)
    .where(like(strategies.name, `%${query}%`))
    .orderBy(desc(strategies.assets))
    .limit(10)

  const strategiesByCategory = Object.values(
    strategies.category.enumValues
  ).map((category) => ({
    category,
    strategies: filteredStrategies.filter(
      (strategy) => strategy.category === category
    ),
  }))

  return strategiesByCategory
}
