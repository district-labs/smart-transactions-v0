import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";


const connection = connect({
  url: process.env.DATABASE_URL,
})

export * from "drizzle-orm";
export * from "./schema";

export const db = drizzle(connection, { schema, logger: true })
