import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * Ensure app buidls with valid env variables.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },

  /**
   * Client-side environment variables schema.
   * To expose to client, all variables should begin with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_WEB3_APP_URL: z.string().url(),
  },

  /**
   * Manual destructuring of `process.env` for Next.js runtimes.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB3_APP_URL: process.env.NEXT_PUBLIC_WEB3_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validaiton
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
