import { int, mysqlTable, serial } from "drizzle-orm/mysql-core";
import { charAddress, charHash } from "../utils/schema";

export const axiomQuery = mysqlTable("axiom_query", {
  id: serial("id").primaryKey(),
  chainId: int("chain_id").notNull(),
  keccakQueryResponse: charHash("keccak_query_response").notNull(),
  blockNumber: int("block_number").notNull(),
  address: charAddress("address"),
  slot: int("slot"),
});

export type DbAxiomQuery = typeof axiomQuery.$inferSelect;
export type DbNewAxiomQuery = typeof axiomQuery.$inferInsert;
