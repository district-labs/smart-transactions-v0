import {
  boolean,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

export const emailPreferences = mysqlTable("email_preferences", {
  id: serial("id").primaryKey(),
  newsletter: boolean("newsletter"),
  marketing: boolean("marketing"),
  transactional: boolean("transactional"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: varchar("user_id", { length: 255 }),
})

export type EmailPreference = typeof emailPreferences.$inferSelect
export type NewEmailPreference = typeof emailPreferences.$inferInsert
