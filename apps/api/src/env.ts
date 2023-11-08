import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server:{
    // Private key for the server's wallet with either 0x prefix or not
    PRIVATE_KEY: z.string().min(64).max(66),
    GOERLI_RPC_URL: z.string().url(),
    MAINNET_RPC_URL: z.string().url(),
    AUTH_NAME: z.string().min(4),
    AUTH_SECRET_KEY: z.string().min(32),
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