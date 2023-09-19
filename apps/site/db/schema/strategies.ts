import { relations } from "drizzle-orm"
import {
  char,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { intentBatchExecution } from "./intents"
import { users } from "./users"

export const strategies = mysqlTable("strategies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  intentBatchExecutionId: int("intent_batch_execution_id"),
  category: mysqlEnum("category", ["strategy", "portfolio"])
    .notNull()
    .default("strategy"),
  assets: decimal("assets", { precision: 12, scale: 2 }).notNull().default("0"),
  coins: json("coins").$type<string[]>().notNull().default(["ethereum"]),
  performanceFee: decimal("performance_fee", { precision: 5, scale: 2 })
    .notNull()
    .default("10.00"),
  platformFee: decimal("platform_fee", { precision: 5, scale: 2 })
    .notNull()
    .default("0.25"),
  managerId: char("manager_id", { length: 42 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export type Strategy = typeof strategies.$inferSelect
export type NewStrategy = typeof strategies.$inferInsert

export const strategiesRelations = relations(strategies, ({ one }) => ({
  manager: one(users, {
    fields: [strategies.managerId],
    references: [users.address],
  }),
  intentBatchExecution: one(intentBatchExecution, {
    fields: [strategies.intentBatchExecutionId],
    references: [intentBatchExecution.id],
  }),
}))
