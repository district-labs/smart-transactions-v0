import { env } from "@/env.mjs";
import { Relayer } from "@openzeppelin/defender-relay-client";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "@openzeppelin/defender-relay-client/lib/ethers";

const credentialsList: Record<number, { apiKey: string; apiSecret: string }> = {
  1: {
    apiKey: env.OPEN_ZEPPELIN_DEFENDER_API_KEY_MAINNET,
    apiSecret: env.OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_MAINNET,
  },
  5: {
    apiKey: env.OPEN_ZEPPELIN_DEFENDER_API_KEY_GOERLI,
    apiSecret: env.OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_GOERLI,
  },
}

export function getRelayerByChainId(chainId: number) {
  if (!credentialsList[chainId]) {
    throw new Error(`No credentials found for chainId ${chainId}`)
  }

  const credentials = credentialsList[chainId]
  const relayerProvider = new DefenderRelayProvider(credentials)
  const relayerSigner = new DefenderRelaySigner(credentials, relayerProvider, {
    speed: "fast",
  })
  const relayer = new Relayer(credentials)

  return {
    relayer,
    relayerSigner,
    relayerProvider,
  }
}
