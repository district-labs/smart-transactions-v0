import { boolean, mysqlTable, serial, timestamp } from "drizzle-orm/mysql-core"

import { charAddress } from "../utils/schema"

export const emailPreferences = mysqlTable("email_preferences", {
  id: serial("id").primaryKey(),
  newsletter: boolean("newsletter"),
  marketing: boolean("marketing"),
  transactional: boolean("transactional"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: charAddress("user_id").notNull(),
})

export type EmailPreference = typeof emailPreferences.$inferSelect
export type NewEmailPreference = typeof emailPreferences.$inferInsert
