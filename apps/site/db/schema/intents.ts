import { relations } from "drizzle-orm"
import {
  boolean,
  char,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

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

export const intentBatch = mysqlTable("intent_batch", {
  id: serial("id").primaryKey(),
  root: char("root", { length: 42 }).notNull(),
  nonce: char("nonce", { length: 66 }).notNull(),
  chainId: int("chain_id").notNull(),
  signature: text("signature").notNull(),
  cancelledTxHash: char("cancelledTxHash", { length: 66 }).unique(),
})

export const intentBatchRelations = relations(intentBatch, ({ many }) => ({
  intents: many(intents),
}))

export type IntentBatch = typeof intentBatch.$inferSelect
export type NewIntentBatch = typeof intentBatch.$inferInsert

export const intentBatchExecution = mysqlTable("intent_batch_execution", {
  id: serial("id").primaryKey(),
  intentBatchId: int("intent_batch_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  executedTxHash: char("executedTxHash", { length: 66 }).unique(),
  executedAt: timestamp("executed_at"),
})

export const intentBatchExecutionRelations = relations(
  intentBatchExecution,
  ({ one, many }) => ({
    intentBatch: one(intentBatch, {
      fields: [intentBatchExecution.id],
      references: [intentBatch.intentBatchExecutionId],
    }),
    hooks: many(hooks),
  })
)

export type IntentBatchExecution = typeof intentBatchExecution.$inferSelect
export type NewIntentBatchExecution = typeof intentBatchExecution.$inferInsert
