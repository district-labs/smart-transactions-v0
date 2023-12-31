import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * Ensure app buidls with valid env variables.
   */
  server: {
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    AUTH_SECRET_KEY: z.string(),
    ALCHEMY_API_KEY: z.string().length(32),
    OPEN_ZEPPELIN_DEFENDER_API_KEY_MAINNET: z.string(),
    OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_MAINNET: z.string(),
    OPEN_ZEPPELIN_DEFENDER_API_KEY_GOERLI: z.string(),
    OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_GOERLI: z.string(),
    PRIVATE_KEY: z.string().min(64).max(66),
    VERCEL_URL: z.string().optional(),
  },

  /**
   * Client-side environment variables schema.
   * To expose to client, all variables should begin with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_SEARCHER_API_URL: z.string().url(),
    NEXT_PUBLIC_ALCHEMY_ID: z.string(),
    NEXT_PUBLIC_WALLET_CONNECT_ID: z.string(),
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
    NEXT_PUBLIC_INFURA_API_KEY: z.string().optional(),
    NEXT_PUBLIC_PROD_NETWORKS_DEV: z.string().optional(),
    NEXT_PUBLIC_USE_PUBLIC_PROVIDER: z.string().optional(),
  },

  /**
   * Manual destructuring of `process.env` for Next.js runtimes.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SEARCHER_API_URL: process.env.NEXT_PUBLIC_SEARCHER_API_URL,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    NEXT_PUBLIC_WALLET_CONNECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    NEXT_PUBLIC_PROD_NETWORKS_DEV: process.env.NEXT_PUBLIC_PROD_NETWORKS_DEV,
    NEXT_PUBLIC_USE_PUBLIC_PROVIDER: process.env.NEXT_PUBLIC_USE_PUBLIC_PROVIDER,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    API_EXECUTE_INTENT_BATCHES: process.env.API_EXECUTE_INTENT_BATCHES,
    OPEN_ZEPPELIN_DEFENDER_API_KEY_MAINNET: process.env.OPEN_ZEPPELIN_DEFENDER_API_KEY_MAINNET,
    OPEN_ZEPPELIN_DEFENDER_API_KEY_GOERLI: process.env.OPEN_ZEPPELIN_DEFENDER_API_KEY_GOERLI,
    OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_GOERLI: process.env.OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_GOERLI,
    OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_MAINNET: process.env.OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_MAINNET,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validaiton
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
