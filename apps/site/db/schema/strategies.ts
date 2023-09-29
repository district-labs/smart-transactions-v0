import { relations } from "drizzle-orm"
import {
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { intentBatch, users } from "."
import { charAddress } from "../utils/schema"

export const strategies = mysqlTable("strategies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["strategy", "portfolio"])
    .notNull()
    .default("strategy"),
  createdAt: timestamp("created_at").defaultNow(),
  managerId: charAddress("manager_id").notNull(),
})

export type Strategy = typeof strategies.$inferSelect
export type NewStrategy = typeof strategies.$inferInsert

export const strategiesRelations = relations(strategies, ({ one, many }) => ({
  manager: one(users, {
    fields: [strategies.managerId],
    references: [users.address],
  }),
  intentBatches: many(intentBatch),
}))
