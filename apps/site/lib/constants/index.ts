export const CHAIN_ID_TO_HUMAN_NAME: Record<
  number,
  {
    name: string
    imgURL?: string
  }
> = {
  1: {
    name: "Ethereum",
    imgURL: "/images/networks/ethereum.svg",
  },
  5: {
    name: "Goerli",
    imgURL: "/images/networks/ethereum-test.svg",
  },
  10: {
    name: "Optimism",
    imgURL: "/images/networks/optimism.svg",
  },
  137: {
    name: "Polygon",
    imgURL: "/images/networks/polygon.svg",
  },
  420: {
    name: "Optimism Goerli",
    imgURL: "/images/networks/optimism.svg",
  },
  8453: {
    name: "Base",
    imgURL: "/images/networks/base.svg",
  },
  31337: {
    name: "Local",
    imgURL: "/images/networks/ethereum-test.svg",
  },
  42161: {
    name: "Arbitrum",
    imgURL: "/images/networks/arbitrum.svg",
  },
  11155111: {
    name: "Sepolia",
    imgURL: "/images/networks/ethereum-test.svg",
  },
}

export const CHAIN_ID_TO_NAME: Record<number, string> = {
  1: "ethereum",
  5: "goerli",
  10: "optimism",
  137: "matic-network",
  420: "optimism-goerli",
  8453: "base",
  42161: "arbitrum",
  11155111: "sepolia",
}

export const NAME_TO_CHAIN_ID: Record<string, number> = {
  ethereum: 1,
  goerli: 5,
  optimism: 10,
  "matic-network": 137,
  "optimism-goerli": 420,
  base: 8453,
  arbitrum: 42161,
  sepolia: 11155111,
}
