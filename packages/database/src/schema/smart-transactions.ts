import { relations } from "drizzle-orm"
import { boolean, int, mysqlEnum, mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"

import { intentBatch, intentModules, users } from "."
import { charAddress } from "../utils/schema"

export const smartTransactions = mysqlTable("smart_transactions", {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    createdBy: charAddress("created_by").notNull(),
    isActive: boolean("is_active").default(false),
    isPublic: boolean("is_public").default(false),
    type: mysqlEnum('type', ['individual', 'team']).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
})

export type DbSmartTransaction = typeof smartTransactions.$inferSelect

export const smartTransactionsRelations = relations(smartTransactions, ({ many, one }) => ({
    creator: one(intentBatch, {
        fields: [smartTransactions.createdBy],
        references: [users.address],
    }),
    intentModules: many(intentModules),
}))
