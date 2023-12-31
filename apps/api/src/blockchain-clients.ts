import type { PublicClient, WalletClient } from "viem";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry, goerli, mainnet } from "viem/chains";
import { env } from "./env";

export const accountShared = privateKeyToAccount(
  env.PRIVATE_KEY as `0x${string}`,
);

const transportMainnet = http(env.MAINNET_RPC_URL);
const transportGoerli = http(env.GOERLI_RPC_URL);

const localGoerli = http(`http://localhost:8545`);

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: transportMainnet,
});

export const goerliPublicClient = createPublicClient({
  chain: goerli,
  transport: transportGoerli,
});

export const localPublicClient = createPublicClient({
  chain: foundry,
  transport: localGoerli,
});

export const mainnetWalletClient = createWalletClient({
  account: accountShared,
  chain: mainnet,
  transport: transportMainnet,
});

export const goerliWalletClient = createWalletClient({
  account: accountShared,
  chain: goerli,
  transport: transportGoerli,
});

export const localWalletClient = createWalletClient({
  account: accountShared,
  chain: foundry,
  transport: localGoerli,
});

type PublicClientList = {
  [key: number]: PublicClient | undefined;
};

type WalletClientList = {
  [key: number]: WalletClient | undefined;
};

export const publicClients: PublicClientList = {
  1: mainnetPublicClient,
  5: goerliPublicClient,
  31337: localPublicClient,
};

export const walletClients: WalletClientList = {
  1: mainnetWalletClient,
  5: goerliWalletClient,
  31337: localWalletClient,
};
