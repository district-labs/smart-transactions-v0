import { useQuery } from "@tanstack/react-query"

interface UseCurrentPriceProps {
  tokenOut: {
    chainId: number
    type: "erc20"
    address: string
  }
  tokenIn: {
    chainId: number
    type: "erc20"
    address: string
  }
}

export function useCurrentPrice({ tokenOut, tokenIn }: UseCurrentPriceProps) {
  const tokenOutCurrentPriceQuery = useQuery({
    queryKey: ["tokenPrice", tokenOut.chainId, tokenOut.type, tokenOut.address],
    queryFn: () =>
      fetch("/api/token/current-price", {
        method: "POST",
        body: JSON.stringify({
          coins: tokenOut,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  })

  const tokenInCurrentPriceQuery = useQuery({
    queryKey: ["tokenPrice", tokenIn.chainId, tokenIn.type, tokenIn.address],
    queryFn: () =>
      fetch("/api/token/current-price", {
        method: "POST",
        body: JSON.stringify({
          coins: tokenIn,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    enabled: !!tokenIn,
  })

  const tokenOutPrice = tokenOutCurrentPriceQuery.data
  const tokenInPrice = tokenInCurrentPriceQuery.data
  const price = tokenInPrice / tokenOutPrice

  async function refetch() {
    await tokenOutCurrentPriceQuery.refetch()
    await tokenInCurrentPriceQuery.refetch()
  }

  const isLoading =
    tokenOutCurrentPriceQuery.isLoading || tokenInCurrentPriceQuery.isLoading
  const isError =
    tokenOutCurrentPriceQuery.isError || tokenInCurrentPriceQuery.isError

  return { price, refetch, tokenOutPrice, tokenInPrice, isLoading, isError }
}
