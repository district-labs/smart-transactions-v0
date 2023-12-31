export const expiryToTimestamp = (expiry: string) => {
  // Timestamp in seconds
  const now = new Date()
  let returnValue: number

  switch (expiry) {
    case "1d":
      now.setDate(now.getDate() + 1)
      returnValue = now.getTime()
      break
    case "1w":
      now.setDate(now.getDate() + 7)
      returnValue = now.getTime()
      break
    case "1m":
      now.setMonth(now.getMonth() + 1)
      returnValue = now.getTime()
      break
    default:
      now.setDate(now.getDate() + 1)
      returnValue = now.getTime()
  }

  return Math.floor(returnValue / 1000)
}
export const defaultTokenOut = {
  name: "USDCoin",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const,
  symbol: "USDC",
  decimals: 6,
  chainId: 1,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
}

export const defaultTokenIn = {
  name: "Wrapped Ether",
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as const,
  symbol: "WETH",
  decimals: 18,
  chainId: 1,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
}
