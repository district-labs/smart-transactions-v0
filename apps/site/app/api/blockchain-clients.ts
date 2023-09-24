import { createPublicClient, createWalletClient, http } from "viem"
import type { PublicClient, WalletClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { goerli, mainnet } from "viem/chains"

const account = privateKeyToAccount(
  (process.env.PRIVATE_KEY as `0x{string}`) || "0x00"
)

const transportMainnet = http(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
)
const transportGoerli = http(
  `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
)

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: transportMainnet,
})

export const goerliPublicClient = createPublicClient({
  chain: goerli,
  transport: transportGoerli,
})

export const mainnetWalletClient = createWalletClient({
  account: account,
  chain: mainnet,
  transport: transportMainnet,
})

export const goerliWalletClient = createWalletClient({
  account: account,
  chain: goerli,
  transport: transportGoerli,
})

type PublicClientList = {
  [key: number]: PublicClient
}

type WalletClientList = {
  [key: number]: WalletClient
}

export const publicClients: PublicClientList = {
  1: mainnetPublicClient,
  5: goerliPublicClient,
}

export const walletClients: WalletClientList = {
  1: mainnetWalletClient,
  5: goerliWalletClient,
}
