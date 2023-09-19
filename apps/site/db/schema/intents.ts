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

export const intents = mysqlTable("intents", {
  // keecak256 hash of the name and version
  id: char("id", { length: 66 }).primaryKey(),
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
  intentBatchId: int("intent_batch_id").notNull(),
})

export const intentsRelations = relations(intents, ({ one }) => ({
  intentBatch: one(intentBatch, {
    fields: [intents.intentBatchId],
    references: [intentBatch.id],
  }),
}))

export const intentBatch = mysqlTable("intent_batch", {
  id: serial("id").primaryKey(),
  // Dimensional nonce
  nonce: char("nonce", { length: 66 }).notNull(),
  intentBatchExecutionId: int("intent_batch_execution_id").notNull(),
})

export const intentBatchRelations = relations(intentBatch, ({ many }) => ({
  intents: many(intents),
}))

export const intentBatchExecution = mysqlTable("intent_batch_execution", {
  id: serial("id").primaryKey(),
  signature: text("signature").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  executed: boolean("executed").notNull().default(false),
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
