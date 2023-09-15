"use server"

import { db } from "@/db"
import { NewUser, users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function checkUserAction(input: { address: string }) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, input.address),
  })

  if (existingUser) {
    throw new Error("User already exists.")
  }
}

export async function updateUserAction(input: NewUser) {
  const user = await db.query.users.findFirst({
    where: eq(users.address, input.address),
  })

  if (!user) {
    throw new Error("User not found.")
  }

  await db.update(users).set(input).where(eq(users.address, input.address))
}
