import 'dotenv/config'
import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  schema: "./src/database/schema.ts",
  out: "./src/database/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config;
