import { relations } from "drizzle-orm"
import {
  char,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { emailPreferences, strategies } from "."

export const users = mysqlTable("users", {
  address: char("address", { length: 42 }).primaryKey(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  safeAddress: char("safe_address", { length: 42 }),
  about: text("about"),
  createdAt: timestamp("created_at").defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const usersRelations = relations(users, ({ one, many }) => ({
  strategies: many(strategies),
  emailPreferences: one(emailPreferences, {
    fields: [users.address],
    references: [emailPreferences.userId],
  }),
}))
