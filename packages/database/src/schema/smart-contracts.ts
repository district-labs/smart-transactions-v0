import { relations } from "drizzle-orm"
import { int, mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"

import { teamsToStrategies, usersToTeams } from "."
import { charAddress } from "../utils/schema"

export const smartContracts = mysqlTable("intent_modules", {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    address: charAddress("address"),
    chainId: int("chain_id"),
    blockDeployed: int("block_deployed"),
    name: varchar("name", { length: 255 }),
    description: text("description"),
})

export type DbSmartContract = typeof smartContracts.$inferSelect

export const smartContractsRelations = relations(smartContracts, ({ one, many }) => ({
  members: many(usersToTeams),
  strategies: many(teamsToStrategies),
}))
