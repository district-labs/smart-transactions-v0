const tokenDecimalsByChainId: Record<number, Record<string, number>> = {
  5: {
    "0xb3c67821F9DCbB424ca3Ddbe0B349024D5E2A739": 18,
    "0x18Be8De03fb9c521703DE8DED7Da5031851CbBEB": 6,
  },
}

export function getTokenDecimals({
  chainId,
  tokenAddress,
}: {
  chainId: number
  tokenAddress: string
}) {
  if (!tokenDecimalsByChainId[chainId][tokenAddress]) {
    return 18
  }
  return tokenDecimalsByChainId[chainId][tokenAddress]
}
