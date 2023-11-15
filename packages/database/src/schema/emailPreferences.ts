import { boolean, mysqlTable, serial, timestamp } from "drizzle-orm/mysql-core";

import { charAddress } from "../utils/schema";

export const emailPreferences = mysqlTable("email_preferences", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  newsletter: boolean("newsletter"),
  marketing: boolean("marketing"),
  transactional: boolean("transactional"),
  userId: charAddress("user_id").notNull(),
});

export type DbEmailPreference = typeof emailPreferences.$inferSelect;
export type DbNewEmailPreferences = typeof emailPreferences.$inferInsert;
