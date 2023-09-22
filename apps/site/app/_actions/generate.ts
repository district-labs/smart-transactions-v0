"use server"

import { db } from "@/db"
import { strategies, type Strategy } from "@/db/schema"
import { faker } from "@faker-js/faker"

export async function generateStrategies({
  managerId,
  count = 5,
}: {
  managerId: number
  count?: number
}) {
  const allStrategies: Strategy[] = []

  for (let i = 0; i < count; i++) {
    allStrategies.push({
      id: faker.number.int({ min: 1, max: 9999 }),
      name: faker.finance.accountName(),
      description: faker.company.buzzPhrase(),
      category: "strategy",
      managerId: String(managerId),
      createdAt: faker.date.past(),
    })
  }
  await db.insert(strategies).values(allStrategies)
}

export async function generateBearStrategy() {
  const allStrategies: Strategy[] = []

  allStrategies.push({
    id: faker.number.int({ min: 1, max: 9999 }),
    name: "ETH Bear Strategy",
    description:
      "Bearish on ethereum? Sell down your position as the price of ETH rises.",
    category: "strategy",
    managerId: "2",
    createdAt: faker.date.past(),
  })
  await db.insert(strategies).values(allStrategies)
}
