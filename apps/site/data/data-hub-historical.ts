export const dataHubHistorical = [
  {
    id: "1",
    chainId: 5,
    timestamp: 1625820000,
    queriesTotal: 64,
    protocols: [
      {
        name: "Uniswap",
        id: "uniswap",
        image:
          "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png?1600306604",
      },
    ],
    queries: [
      {
        type: "UniswapV3Twap",
        blockNumber: 420,
        metadata: {
          tokens: [
            {
              name: "USD Coin",
              symbol: "USDC",
              address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
            },
            {
              name: "Wrapped Ether",
              symbol: "WETH",
              address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            },
          ],
        },
      },
    ],
  },
]
