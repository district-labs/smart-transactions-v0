import "dotenv/config"

import { sql } from "drizzle-orm"

import { db } from "../.."
import {
  emailPreferences,
  intentBatch,
  intents,
  strategies,
  users,
} from "../../schema"
import { INTENT_BATCH_DATA, SEED_USER_ADDRESS, STRATEGY_ID } from "./data"

async function main() {
  await db.transaction(async (tx) => {
    // Ensures that the user is created if it doesn't exist
    await tx
      .insert(users)
      .values({
        address: SEED_USER_ADDRESS,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@email.com",
        about: "Admin",
      })
      .onDuplicateKeyUpdate({ set: { address: sql`address` } })

    // Ensures that the email preferences are created if they don't exist
    await tx
      .insert(emailPreferences)
      .values({
        marketing: true,
        newsletter: true,
        transactional: true,
        userId: SEED_USER_ADDRESS,
      })
      .onDuplicateKeyUpdate({ set: { id: sql`id` } })

    // Ensure Strategy id 1 is created if it doesn't exist
    await tx
      .insert(strategies)
      .values({
        id: STRATEGY_ID,
        managerId: SEED_USER_ADDRESS,
        name: `Strategy ${STRATEGY_ID}`,
        description: `Test Strategy ${STRATEGY_ID}`,
      })
      .onDuplicateKeyUpdate({ set: { id: sql`id` } })

    const {
      nonce,
      intentBatchHash,
      chainId,
      intents: intentsData,
      root,
      signature,
    } = INTENT_BATCH_DATA
    const intentBatchResult = await tx.insert(intentBatch).values({
      intentBatchHash,
      nonce,
      chainId,
      root,
      signature,
      strategyId: STRATEGY_ID,
      userId: SEED_USER_ADDRESS,
    })

    const intentBatchId = Number(intentBatchResult.insertId)

    await tx.insert(intents).values(
      intentsData.map((intent) => ({
        intentId: intent.intentId,
        intentArgs: intent.intentArgs,
        root: intent.root,
        target: intent.target,
        data: intent.data,
        intentBatchId: intentBatchHash,
      }))
    )
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
