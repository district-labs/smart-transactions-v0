import { createPublicClient, http } from 'viem'
import { goerli, mainnet } from 'viem/chains'

const transportMainnet = http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
const transportGoerli = http(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: transportMainnet
})

export const goerliPublicClient = createPublicClient({
  chain: goerli,
  transport: transportGoerli
})