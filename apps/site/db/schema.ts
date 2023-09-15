import { relations } from "drizzle-orm"
import {
  boolean,
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

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  address: char("address", { length: 42 }).notNull(),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  email: varchar("email", { length: 255 }),
  about: text("about"),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const usersRelations = relations(users, ({ many }) => ({
  strategies: many(strategies),
  investments: many(investments),
}))

export const strategies = mysqlTable("strategies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["strategy", "portfolio"])
    .notNull()
    .default("strategy"),
  assets: decimal("assets", { precision: 12, scale: 2 }).notNull().default("0"),
  coins: json("coins").$type<string[]>().notNull().default(["ethereum"]),
  performanceFee: decimal("performanceFee", { precision: 5, scale: 2 })
    .notNull()
    .default("10.00"),
  platformFee: decimal("platformFee", { precision: 5, scale: 2 })
    .notNull()
    .default("0.25"),
  managerId: int("managerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type Strategy = typeof strategies.$inferSelect
export type NewStrategy = typeof strategies.$inferInsert

export const strategiesRelations = relations(strategies, ({ one }) => ({
  manager: one(users, {
    fields: [strategies.managerId],
    references: [users.id],
  }),
}))

export const investments = mysqlTable("investments", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  strategyId: int("strategyId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type Investment = typeof investments.$inferSelect
export type NewInvestment = typeof investments.$inferInsert

export const emailPreferences = mysqlTable("email_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  newsletter: boolean("newsletter").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  transactional: boolean("transactional").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type EmailPreference = typeof emailPreferences.$inferSelect
export type NewEmailPreference = typeof emailPreferences.$inferInsert
