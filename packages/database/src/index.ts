import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";
export { schema };


const connection = connect({
  url: process.env.DATABASE_URL,
})

export const db = drizzle(connection, { schema, logger: true })

export * from "drizzle-orm";
export * from "./queries";
export * from "./schema";
export * from "./writes";

