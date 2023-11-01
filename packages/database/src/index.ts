import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";
export { schema };


const connection = connect({
  url: process.env.DATABASE_URL,
})

export * from "drizzle-orm";

// Schema
export * from "./schema/emailPreferences";
export * from "./schema/intents";
export * from "./schema/strategies";
export * from "./schema/users";

// Queries
  export * from "./queries/intent-batch";
export * from "./queries/intent-batch-execution";

// Writes
export * from "./writes/intent-batch";
export * from "./writes/intent-batch-execution";

// Database
export const db = drizzle(connection, { schema, logger: true })
