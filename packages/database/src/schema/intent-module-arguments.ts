import { relations } from "drizzle-orm"
import { mysqlEnum, mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"

import { intentModules, smartContracts } from "./"
import { charHash } from "../utils/schema"

export const intentModuleArguments = mysqlTable("intent_modules", {
    id: charHash("intent_module_id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    intentModuleId: charHash("intent_module_id"),
    name: varchar("name", { length: 255 }),
    type: mysqlEnum('type', ['address', 'uint256', 'bytes', 'bytes32']).notNull(),
    value: text("value"),
})

export type DbIntentModuleArgument = typeof intentModuleArguments.$inferSelect

export const intentModuleArgumentsRelations = relations(intentModuleArguments, ({ one }) => ({
  intentModule: one(intentModuleArguments, {
    fields: [intentModules.id],
    references: [smartContracts.id],
  }),
}))
