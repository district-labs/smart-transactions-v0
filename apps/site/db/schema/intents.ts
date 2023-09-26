import { relations } from "drizzle-orm"
import {
  char,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/mysql-core"

import { strategies } from "."

// ------------------ INTENT ------------------ //

export const intents = mysqlTable("intents", {
  id: serial("id").primaryKey(),
  intentId: char("intent_id", { length: 66 }).notNull(), // keccack256 name and version of intent module
  intentBatchId: int("intent_batch_id").notNull(),
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
})

export const intentsRelations = relations(intents, ({ one }) => ({
  intentBatch: one(intentBatch, {
    fields: [intents.intentBatchId],
    references: [intentBatch.id],
  }),
}))

export type Intent = typeof intents.$inferSelect
export type NewIntent = typeof intents.$inferInsert

// ------------------ INTENT BATCH ------------------ //

export const intentBatch = mysqlTable("intent_batch", {
  id: serial("id").primaryKey(),
  intentBatchHash: char("intent_batch_hash", { length: 66 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  root: char("root", { length: 42 }).notNull(),
  nonce: char("nonce", { length: 66 }).notNull(),
  chainId: int("chain_id").notNull(),
  signature: text("signature").notNull(),
  executedTxHash: char("executed_tx_hash", { length: 66 }).unique(),
  executedAt: timestamp("executed_at"),
  cancelledTxHash: char("cancelled_tx_hash", { length: 66 }).unique(),
  cancelledAt: timestamp("cancelled_at"),
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
export type DBIntentBatch = typeof intentBatch.$inferSelect
export type NewIntentBatch = typeof intentBatch.$inferInsert

// ------------------ HOOKS ------------------ //

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

// ------------------ INTENT BATCH EXECUTION ------------------ //

export const intentBatchExecution = mysqlTable("intent_batch_execution", {
  id: serial("id").primaryKey(),
  intentBatchId: int("intent_batch_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  executedTxHash: char("executed_tx_hash", { length: 66 }).unique(),
  executedAt: timestamp("executed_at"),
})

export const intentBatchExecutionRelations = relations(
  intentBatchExecution,
  ({ one, many }) => ({
    hooks: many(hooks),
    intentBatch: one(intentBatch, {
      fields: [intentBatchExecution.intentBatchId],
      references: [intentBatch.id],
    }),
  })
)

export type IntentBatchExecution = typeof intentBatchExecution.$inferSelect
export type NewIntentBatchExecution = typeof intentBatchExecution.$inferInsert
