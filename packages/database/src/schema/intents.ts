import { InferSelectModel, relations } from "drizzle-orm"
import {
  boolean,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/mysql-core"

import { DbStrategy, DbUser, strategies, users } from "."
import { charAddress, charHash } from "../utils/schema"
import { DbTransaction, transaction } from "./transaction"

// ------------------ INTENT ------------------ //

export const intents = mysqlTable("intents", {
  id: serial("id").primaryKey(),
  intentId: charHash("intent_id").notNull(), // keccack256 name and version of intent module
  intentBatchId: charHash("intent_batch_id").notNull(),
  intentArgs: json("intent_args")
    .$type<
      {
        name: string
        type: string
        value: string | number
      }[]
    >()
    .notNull(),
  root: charAddress("root").notNull(),
  target: charAddress("target").notNull(),
  data: text("data"),
  value: int("value").default(0),
  isInvalid: boolean("isInvalid").default(false),
})

export const intentsRelations = relations(intents, ({ one }) => ({
  intentBatch: one(intentBatch, {
    fields: [intents.intentBatchId],
    references: [intentBatch.intentBatchHash],
  }),
}))

export type DbIntent = typeof intents.$inferSelect
export type DbNewIntent = typeof intents.$inferInsert

// ------------------ INTENT BATCH ------------------ //

export const intentBatch = mysqlTable("intent_batch", {
  intentBatchHash: charHash("intent_batch_hash").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  root: charAddress("root").notNull(),
  nonce: charHash("nonce").notNull(),
  chainId: int("chain_id").notNull(),
  signature: text("signature").notNull(),
  executedAt: timestamp("executed_at"),
  cancelledTxHash: charHash("cancelled_tx_hash").unique(),
  cancelledAt: timestamp("cancelled_at"),
  strategyId: charHash("strategy_id").notNull(),
  userId: charAddress("user_id").notNull(),
})

export const intentBatchRelations = relations(intentBatch, ({ one, many }) => ({
  intents: many(intents),
  executedTxs: many(transaction),
  user: one(users, {
    fields: [intentBatch.userId],
    references: [users.address],
  }),
  strategy: one(strategies, {
    fields: [intentBatch.strategyId],
    references: [strategies.id],
  }),
  intentBatchExecution: one(intentBatchExecution, {
    fields: [intentBatch.intentBatchHash],
    references: [intentBatchExecution.intentBatchId],
  }),
}))

export type DbIntentBatch = typeof intentBatch.$inferSelect
export type DbNewIntentBatch = typeof intentBatch.$inferInsert
export type DbIntentBatchWithRelations = InferSelectModel<typeof intentBatch> & {
  user?: DbUser
  intents?: DbIntent[]
  strategy?: DbStrategy
  intentBatchExecution?: DbIntentBatchExecution
  executedTxs?: DbTransaction[]
}

// ------------------ HOOKS ------------------ //

export const hooks = mysqlTable("hooks", {
  id: serial("id").primaryKey(),
  target: charAddress("target").notNull(),
  data: text("data"),
  instructions: text("instructions"),
  intentBatchExecutionId: int("intent_batch_execution_id").notNull(),
})

export const hooksRelations = relations(hooks, ({ one }) => ({
  intentBatchExecution: one(intentBatchExecution, {
    fields: [hooks.intentBatchExecutionId],
    references: [intentBatchExecution.id],
  }),
}))

export type DbHook = typeof hooks.$inferSelect
export type DbNewHook = typeof hooks.$inferInsert

// ------------------ INTENT BATCH EXECUTION ------------------ //

export const intentBatchExecution = mysqlTable("intent_batch_execution", {
  id: serial("id").primaryKey(),
  executor: charAddress("executor").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  intentBatchId: charAddress("intent_batch_id").notNull(),
})

export const intentBatchExecutionRelations = relations(
  intentBatchExecution,
  ({ one, many }) => ({
    hooks: many(hooks),
    intentBatch: one(intentBatch, {
      fields: [intentBatchExecution.intentBatchId],
      references: [intentBatch.intentBatchHash],
    }),
  })
)

export type DbIntentBatchExecution = typeof intentBatchExecution.$inferSelect
export type DbNewIntentBatchExecution = typeof intentBatchExecution.$inferInsert
