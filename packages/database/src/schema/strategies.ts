import { relations } from "drizzle-orm"
import {
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { intentBatch, teamsToStrategies, users } from "."
import { charAddress, charHash } from "../utils/schema"

export const strategies = mysqlTable("strategies", {
  id: charHash("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  alias: varchar("alias", { length: 255 }).notNull(),
  managerId: charAddress("manager_id").notNull(),
})

export type DbStrategy = typeof strategies.$inferSelect
export type DbNewStrategy = typeof strategies.$inferInsert

export const strategiesRelations = relations(strategies, ({ one, many }) => ({
  manager: one(users, {
    fields: [strategies.managerId],
    references: [users.address],
  }),
  intentBatches: many(intentBatch),
  teams: many(teamsToStrategies),
}))
