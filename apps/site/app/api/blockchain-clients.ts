import { createWalletClient, http } from "viem"
import type { WalletClient } from "viem"
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

type KeyList = {
  [key: number]: WalletClient
}

export const publicClients: KeyList = {
  1: mainnetWalletClient,
  5: goerliWalletClient,
}
