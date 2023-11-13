import { relations } from "drizzle-orm"
import { boolean, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core"

import { emailPreferences, strategies, teams, usersToTeams } from "."
import { charAddress } from "../utils/schema"

export const users = mysqlTable("users", {
  address: charAddress("address").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  isRegistered: boolean("is_registered").default(false),
  firstName: varchar("first_name", { length: 255 }).default("Anonymous"),
  lastName: varchar("last_name", { length: 255 }).default("Degen"),
  email: varchar("email", { length: 255 }),
  safeAddress: charAddress("safe_address")
})

export const usersRelations = relations(users, ({ one, many }) => ({
  strategies: many(strategies),
  teams: many(usersToTeams),
  emailPreferences: one(emailPreferences, {
    fields: [users.address],
    references: [emailPreferences.userId],
  }),
}))

export type DbNewUser = typeof users.$inferInsert
export type DbUser = typeof users.$inferSelect