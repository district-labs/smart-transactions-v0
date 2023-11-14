import { Relayer } from "@openzeppelin/defender-relay-client";

const credentialsList: Record<number, { apiKey: string; apiSecret: string }> = {
  5: {
    apiKey: process.env.OPEN_ZEPPELIN_DEFENDER_API_KEY_GOERLI as string,
    apiSecret: process.env.OPEN_ZEPPELIN_DEFENDER_SECRET_KEY_GOERLI as string,
  },
};

export function getRelayerByChainId(chainId: number) {
  if (!credentialsList[chainId]) {
    throw new Error(`No credentials found for chainId ${chainId}`);
  }

  const credentials = credentialsList[chainId];

  const relayer = new Relayer(credentials);
  return relayer;
}
