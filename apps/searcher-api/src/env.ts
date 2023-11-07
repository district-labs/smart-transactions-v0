import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    GOERLI_RPC_URL: z.string().url(),
    PORT: z.string().default("3000"),
    CORS_ORIGIN: z.string(),
    OPEN_ZEPPELIN_DEFENDER_API_KEY_MAINNET: z.string().length(32),
    OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_MAINNET: z.string().length(64),
    OPEN_ZEPPELIN_DEFENDER_API_KEY_GOERLI: z.string().length(32),
    OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_GOERLI: z.string().length(64),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
