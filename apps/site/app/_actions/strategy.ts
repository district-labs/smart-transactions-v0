"use server"

import { db } from "@/db"
import { strategies, Strategy } from "@/db/schema"
import { and, asc, desc, gte, inArray, like, lte, sql } from "drizzle-orm"
import { z } from "zod"

import { getStrategiesSchema } from "@/lib/validations/strategy"

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

export async function getStrategiesAction(
  input: z.infer<typeof getStrategiesSchema>
) {
  const [column, order] =
    (input.sort?.split(".") as [
      keyof Strategy | undefined,
      "asc" | "desc" | undefined,
    ]) ?? []
  const [minAssets, maxAssets] = input.assets_range?.split("-") ?? []
  const categories =
    (input.categories?.split(".") as Strategy["category"][]) ?? []
  const managerIds = input.manager_ids?.split(".").map(Number) ?? []

  const { items, count } = await db.transaction(async (tx) => {
    const items = await tx
      .select()
      .from(strategies)
      .limit(input.limit)
      .offset(input.offset)
      .where(
        and(
          categories.length
            ? inArray(strategies.category, categories)
            : undefined,
          minAssets ? gte(strategies.assets, minAssets) : undefined,
          maxAssets ? lte(strategies.assets, maxAssets) : undefined,
          managerIds.length
            ? inArray(strategies.managerId, managerIds)
            : undefined
        )
      )
      .groupBy(strategies.id)
      .orderBy(
        column && column in strategies
          ? order === "asc"
            ? asc(strategies[column])
            : desc(strategies[column])
          : desc(strategies.createdAt)
      )

    const count = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(strategies)
      .where(
        and(
          categories.length
            ? inArray(strategies.category, categories)
            : undefined,
          minAssets ? gte(strategies.assets, minAssets) : undefined,
          maxAssets ? lte(strategies.assets, maxAssets) : undefined,
          managerIds.length
            ? inArray(strategies.managerId, managerIds)
            : undefined
        )
      )
      .execute()
      .then((res) => res[0].count ?? 0)

    return {
      items,
      count,
    }
  })

  return {
    items,
    count,
  }
}
