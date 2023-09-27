import type { PublicClient, WalletClient } from "viem"
import { createPublicClient, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { foundry, goerli, mainnet } from "viem/chains"

export const accountShared = privateKeyToAccount(
  (process.env.PRIVATE_KEY as `0x{string}`) || "0x00"
)

const transportMainnet = http(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
)
const transportGoerli = http(
  `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
)

const localGoerli = http(
  `http://localhost:8545`
)

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: transportMainnet,
})

export const goerliPublicClient = createPublicClient({
  chain: goerli,
  transport: transportGoerli,
})

export const localPublicClient = createPublicClient({
  chain: foundry,
  transport: localGoerli,
})

export const mainnetWalletClient = createWalletClient({
  account: accountShared,
  chain: mainnet,
  transport: transportMainnet,
})

export const goerliWalletClient = createWalletClient({
  account: accountShared,
  chain: goerli,
  transport: transportGoerli,
})

export const localWalletClient = createWalletClient({
  account: accountShared,
  chain: foundry,
  transport: localGoerli,
})

type PublicClientList = {
  [key: number]: PublicClient | undefined
}

type WalletClientList = {
  [key: number]: WalletClient | undefined
}

export const publicClients: PublicClientList = {
  1: mainnetPublicClient,
  5: goerliPublicClient,
  31337: localPublicClient,
}

export const walletClients: WalletClientList = {
  1: mainnetWalletClient,
  5: goerliWalletClient,
  31337: localWalletClient,
}
