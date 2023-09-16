import { useQuery } from "wagmi"

interface EthPrice {
  ethereum: {
    usd: number
  }
}

interface BtcPrice {
  bitcoin: {
    usd: number
  }
}

export const useEthPrice = () => {
  return useQuery(["eth-price"], {
    cacheTime: 1000 * 60 * 30, // 30 minutes
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
      const data: EthPrice = await response.json()
      return data?.ethereum?.usd
    },
  })
}

export const useBtcPrice = () => {
  return useQuery(["btc-price"], {
    cacheTime: 1000 * 60 * 30, // 30 minutes
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      )
      const data: BtcPrice = await response.json()
      return data?.bitcoin?.usd
    },
  })
}
