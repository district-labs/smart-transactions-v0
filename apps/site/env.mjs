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
    RESEND_API_KEY: z.string(),
    EMAIL_FROM_ADDRESS: z.string().email(),
    API_EXECUTE_INTENT_BATCHES: z.string(),
    JWT_SECRET: z.string(),
    // Comma separated list of Ethereum addresses, accepts optinal whitespace after comma
    APP_ADMINS: z
      .string()
      .regex(/^(0x[a-fA-F0-9]{40}( *, *0x[a-fA-F0-9]{40})* *)*$/)
      .optional(),
  },

  /**
   * Client-side environment variables schema.
   * To expose to client, all variables should begin with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
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
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    NEXT_PUBLIC_WALLET_CONNECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    NEXT_PUBLIC_PROD_NETWORKS_DEV: process.env.NEXT_PUBLIC_PROD_NETWORKS_DEV,
    NEXT_PUBLIC_USE_PUBLIC_PROVIDER: process.env.NEXT_PUBLIC_USE_PUBLIC_PROVIDER,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
    API_EXECUTE_INTENT_BATCHES: process.env.API_EXECUTE_INTENT_BATCHES,
    JWT_SECRET: process.env.JWT_SECRET,
    APP_ADMINS: process.env.APP_ADMINS,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validaiton
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
