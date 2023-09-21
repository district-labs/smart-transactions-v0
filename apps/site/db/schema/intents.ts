import { relations } from "drizzle-orm"
import {
  char,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { strategies } from "."

export const intentBatch = mysqlTable("intent_batch", {
  id: serial("id").primaryKey(),
  root: char("root", { length: 42 }).notNull(),
  nonce: char("nonce", { length: 66 }).notNull(),
  chainId: int("chain_id").notNull(),
  signature: text("signature").notNull(),
  cancelledTxHash: char("cancelled_tx_hash", { length: 66 }).unique(),
  strategyId: int("strategy_id").notNull(),
})

export const intentBatchRelations = relations(intentBatch, ({ one, many }) => ({
  intents: many(intents),
  strategy: one(strategies, {
    fields: [intentBatch.strategyId],
    references: [strategies.id],
  }),
  intentBatchExecution: one(intentBatchExecution, {
    fields: [intentBatch.id],
    references: [intentBatchExecution.intentBatchId],
  }),
}))

export type IntentBatch = typeof intentBatch.$inferSelect
export type NewIntentBatch = typeof intentBatch.$inferInsert

export const intentBatchExecution = mysqlTable("intent_batch_execution", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  executedTxHash: char("executedTxHash", { length: 66 }).unique(),
  executedAt: timestamp("executed_at"),
  intentBatchId: int("intent_batch_id"),
})

export const intentBatchExecutionRelations = relations(
  intentBatchExecution,
  ({ many }) => ({
    hooks: many(hooks),
  })
)

export type IntentBatchExecution = typeof intentBatchExecution.$inferSelect
export type NewIntentBatchExecution = typeof intentBatchExecution.$inferInsert

export const hooks = mysqlTable("hooks", {
  id: serial("id").primaryKey(),
  target: char("target", { length: 42 }).notNull(),
  data: text("data"),
  intentBatchExecutionId: int("intent_batch_execution_id").notNull(),
})

export const hooksRelations = relations(hooks, ({ one }) => ({
  intentBatchExecution: one(intentBatchExecution, {
    fields: [hooks.intentBatchExecutionId],
    references: [intentBatchExecution.id],
  }),
}))

export type Hook = typeof hooks.$inferSelect
export type NewHook = typeof hooks.$inferInsert

export const intents = mysqlTable("intents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  // Semver version of the intent e.g. 1.0.0
  version: char("version", { length: 5 }).notNull(),
  intentArgs: json("intent_args")
    .$type<
      {
        name: string
        type: string
        value: string | number
      }[]
    >()
    .notNull(),
  root: char("root", { length: 42 }).notNull(),
  target: char("target", { length: 42 }).notNull(),
  data: text("data"),
  value: int("value").default(0),
  intentBatchId: int("intent_batch_id").notNull(),
})

export const intentsRelations = relations(intents, ({ one }) => ({
  intentBatch: one(intentBatch, {
    fields: [intents.intentBatchId],
    references: [intentBatch.id],
  }),
}))

export type Intent = typeof intents.$inferSelect
export type NewIntent = typeof intents.$inferInsert
