import "dotenv/config"
import { sql } from "drizzle-orm"
import { db } from "../.."
import {
  emailPreferences,
  intentBatch,
  intents,
  strategies,
  users,
} from "../schema"
import { INTENT_BATCH_DATA, SEED_USER_ADDRESS } from "./data"
import { strategiesBeta } from "./strategies"

async function main() {
  await db.transaction(async (tx) => {
    // Ensures that the user is created if it doesn't exist
    await tx
      .insert(users)
      .values({
        address: SEED_USER_ADDRESS,
        firstName: "District",
        lastName: "Finance",
        email: "admin@districtfinance.com",
        safeAddress: '0x000000000000000000000000000000000000dEaD'
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

    strategiesBeta.map(async strategy => {
        await tx
        .insert(strategies)
        .values({
          id: strategy.id,
          alias: strategy.alias,
          name: strategy.name,
          description: strategy.description,
          managerId: SEED_USER_ADDRESS,
        })
        // .onDuplicateKeyUpdate({ set: { id: sql`id` } })
      })

    // const {
    //   nonce,
    //   intentBatchHash,
    //   chainId,
    //   intents: intentsData,
    //   root,
    //   signature,
    // } = INTENT_BATCH_DATA
    
    // await tx.insert(intentBatch).values({
    //   intentBatchHash,
    //   nonce,
    //   chainId,
    //   root,
    //   signature,
    //   strategyId: limitOrderStrategy.id,
    //   userId: SEED_USER_ADDRESS,
    // })

    // await tx.insert(intents).values(
    //   intentsData.map((intent) => ({
    //     intentId: intent.intentId,
    //     intentArgs: intent.intentArgs,
    //     root: intent.root,
    //     target: intent.target,
    //     data: intent.data,
    //     intentBatchId: intentBatchHash,
    //   }))
    // )
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
