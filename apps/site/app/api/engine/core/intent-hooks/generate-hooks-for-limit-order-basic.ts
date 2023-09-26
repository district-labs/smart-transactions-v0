import { ADDRESS_ZERO, type Hook } from "@district-labs/intentify-utils"

import { routeSwapExactOutput } from "@/lib/uniswap-v3/routing"

const RUNTIME_ENGINE_ADDRESS = "0x0"

interface Token {
  address: `0x${string}`
  decimals: number
}

interface GenerateHooksForLimitOrderBasicParams {
  chainId: number
  inputToken: Token
  outputToken: Token
  amountOut: `0x${string}`
  recipient: `0x${string}`
}

export async function generateHooksForLimitOrderBasic({
  chainId,
  inputToken,
  outputToken,
  amountOut,
  recipient,
}: GenerateHooksForLimitOrderBasicParams): Promise<Hook[]> {
  // 1. Timestamp Intent == No Hook
  // 2. Token Release Intent == No Hook
  // 3. Limit Order Intent == Fill on Uniswap

  const route = await routeSwapExactOutput({
    chainId,
    amountOut,
    inputToken,
    outputToken,
    recipient,
  })

  if (!route?.methodParameters) throw new Error("route not found")

  const { to, calldata } = route.methodParameters

  return [
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
    // TODO: encode call to engine hub
    {
      target: to as `0x${string}`,
      data: calldata as `0x${string}`,
    },
  ]
}
