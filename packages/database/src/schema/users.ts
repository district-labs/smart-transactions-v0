import { relations } from "drizzle-orm"
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core"

import { emailPreferences, strategies } from "."
import { charAddress } from "../utils/schema"

export const users = mysqlTable("users", {
  address: charAddress("address").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  safeAddress: charAddress("safe_address")
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
