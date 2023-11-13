import { relations } from "drizzle-orm";
import { int, mysqlTable, serial, timestamp } from "drizzle-orm/mysql-core";

import { intentBatch } from ".";
import { charAddress, charHash } from "../utils/schema";

export const transaction = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  intentBatchId: charHash("intent_batch_id"),
  chainId: int("chain_id").notNull(),
  transactionHash: charHash("transaction_hash"),
  blockHash: charHash("block_hash"),
  blockNumber: int("block_number"),
  to: charAddress("to"),
});

export type DbTransaction = typeof transaction.$inferSelect;
export type DbInsertTransaction = typeof transaction.$inferInsert;

export const transactionRelations = relations(transaction, ({ one }) => ({
  intentBatch: one(intentBatch, {
    fields: [transaction.intentBatchId],
    references: [intentBatch.intentBatchHash],
  }),
}));
