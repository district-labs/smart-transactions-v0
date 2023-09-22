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
