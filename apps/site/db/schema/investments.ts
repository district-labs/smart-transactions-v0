import { relations } from "drizzle-orm"
import {
  int,
  mysqlTable,
  serial,
  timestamp,
} from "drizzle-orm/mysql-core"

import { strategies } from "./strategies"
import { users } from "./users"

export const investments = mysqlTable("investments", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: int("user_id").notNull(),
  strategyId: int("strategy_id").notNull(),
})

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, {
    fields: [investments.userId],
    references: [users.address],
  }),
  strategy: one(strategies, {
    fields: [investments.strategyId],
    references: [strategies.id],
  }),
}))

export type Investment = typeof investments.$inferSelect
export type NewInvestment = typeof investments.$inferInsert