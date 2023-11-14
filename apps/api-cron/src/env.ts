import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CORE_API_URL: z.string().url(),
    SEARCHER_API_URL: z.string().url(),
  },
  runtimeEnv: {
    CORE_API_URL: process.env.CORE_API_URL,
    SEARCHER_API_URL: process.env.SEARCHER_API_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
