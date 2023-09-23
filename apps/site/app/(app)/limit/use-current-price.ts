import { type DeFiLlamaCoinsInput } from "@/types"
import { useQuery } from "@tanstack/react-query"

interface UseCurrentPriceProps {
  token: DeFiLlamaCoinsInput
}

export function useCurrentPrice({ token }: UseCurrentPriceProps) {
  const currentPriceQuery = useQuery({
    queryKey: ["tokenPrice", token.chainId, token.type],
    queryFn: () =>
      fetch("/api/token/current-price", {
        method: "POST",
        body: JSON.stringify({
          coins: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  })

  return currentPriceQuery
}
