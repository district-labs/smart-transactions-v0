import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useChainId } from "wagmi"

type Token =
  | {
      chainId?: number
      type: "erc20"
      address: string | undefined
    }
  | {
      chainId?: number
      type: "native"
    }

interface QueryOptions
  extends Omit<
    UseQueryOptions<number, unknown, number, (string | Token)[]>,
    "initialData" | "queryKey"
  > {
  initialData?: (() => undefined) | undefined
}

interface UseCurrentPriceProps extends QueryOptions {
  token: Token
}

export function useCurrentPrice({
  token,
  ...queryOptions
}: UseCurrentPriceProps) {
  const defaultChainId = useChainId()

  const fetcher = async () => {
    const response = await fetch("/api/token/current-price", {
      method: "POST",
      body: JSON.stringify({
        coins: {
          ...token,
          chainId: token.chainId || defaultChainId,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())

    if (typeof response !== "number") {
      throw new Error("Error fetching current price")
    }

    return response
  }

  return useQuery({
    queryKey: ["token-current-price", token],
    queryFn: fetcher,
    ...queryOptions,
  })
}

type useCurrentPriceERC20Props = QueryOptions & {
  token: {
    chainId?: number
    address: string | undefined
  }
}

// Wrapper for useCurrentPrice that sets type to erc20
export function useCurrentPriceERC20({ token }: useCurrentPriceERC20Props) {
  return useCurrentPrice({
    token: { ...token, type: "erc20" },
  })
}

type useCurrentPriceNativeProps = QueryOptions &
  Pick<UseCurrentPriceProps["token"], "chainId">

// Wrapper for useCurrentPrice that sets type to native
export function useCurrentPriceNative({
  chainId,
  ...queryOptions
}: useCurrentPriceNativeProps) {
  return useCurrentPrice({
    token: {
      chainId,
      type: "native",
    },
    ...queryOptions,
  })
}
