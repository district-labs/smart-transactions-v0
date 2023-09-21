"use client"

import { useTransition } from "react"
import { db } from "@/db"
import { strategies, type Strategy } from "@/db/schema"
import { faker } from "@faker-js/faker"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

export async function generateBearStrategy() {
  const allStrategies: Strategy[] = []

  allStrategies.push({
    id: faker.number.int({ min: 1, max: 9999 }),
    name: "ETH Bear Strategy",
    description:
      "Bearish on ethereum? Sell down your position as the price of ETH rises.",
    category: "strategy",
    managerId: "1",
    createdAt: faker.date.past(),
  })
  await db.insert(strategies).values(allStrategies)
}

export function GenerateButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      className="h-8 px-2 lg:px-3"
      onClick={() => {
        startTransition(async () => {
          try {
            await generateBearStrategy()
            toast({ description: "Strategies generated successfully." })
          } catch (err) {
            catchError(err)
          }
        })
      }}
    >
      {isPending && (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      Generate Strategy
    </Button>
  )
}
