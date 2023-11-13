import { relations } from "drizzle-orm"
import { mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"

import { intentModuleArguments, smartContracts } from "./"
import { charHash } from "../utils/schema"

export const intentModules = mysqlTable("intent_modules", {
    id: charHash("intent_module_id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
})

export type DbIntentModule = typeof intentModules.$inferSelect

export const intentModulesRelations = relations(intentModules, ({ many }) => ({
  args: many(intentModuleArguments),
  deployments: many(smartContracts),
}))
