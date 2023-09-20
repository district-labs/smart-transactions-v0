"use server"

import { db } from "@/db"
import { users, type NewUser } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserAction(address: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, address),
  })

  if (!existingUser) {
    throw new Error("User does not exist.")
  }

  return existingUser
}

export async function checkExistingUserAction(address: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, address),
  })

  return !!existingUser
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
