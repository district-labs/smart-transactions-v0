import {
  ADDRESS_ZERO,
  engineHubABI,
  EngineHubAddressList,
  tokenRouterReleaseIntentABI,
  TokenRouterReleaseIntentAddressList,
  type Hook,
} from "@district-labs/intentify-core"
import { encodeFunctionData } from "viem"
import { erc20ABI } from "wagmi"

import { routeSwapExactOutput } from "@/lib/uniswap-v3/routing"

interface Token {
  address: `0x${string}`
  decimals: number
}

interface GenerateHooksForLimitOrderBasicParams {
  chainId: number
  inputToken: Token
  outputToken: Token
  amountInMax: string
  amountOut: `0x${string}`
  recipient: `0x${string}`
}

export async function generateHooksForLimitOrderBasic({
  chainId,
  // Amount in max is the amount of the input token that the user is willing to spend
  amountInMax,
  inputToken,
  outputToken,
  amountOut,
  recipient,
}: GenerateHooksForLimitOrderBasicParams): Promise<Hook[]> {
  const engineHubAddress = EngineHubAddressList[chainId]
  const tokenRouterReleaseIntentAddress =
    TokenRouterReleaseIntentAddressList[chainId]

  // Token Release claim
  const tokenRouterReleaseClaimData = encodeFunctionData({
    abi: tokenRouterReleaseIntentABI,
    functionName: "claim",
    args: [
      recipient,
      engineHubAddress,
      inputToken.address,
      BigInt(amountInMax),
    ],
  })

  // Uniswap V3 routing
  const route = await routeSwapExactOutput({
    chainId,
    amountOut,
    inputToken,
    outputToken,
    recipient,
  })

  if (!route?.methodParameters) throw new Error("route not found")

  const { to: uniV3SwapperAddress, calldata: uniV3SwapData } =
    route.methodParameters

  // Approve uniV3SwapperAddress to spend inputToken
  const approveInputTokenData = encodeFunctionData({
    abi: erc20ABI,
    functionName: "approve",
    args: [uniV3SwapperAddress as `0x${string}`, BigInt(amountInMax)],
  })

  // Engine Hub multicall
  const engineHubMulticallData = encodeFunctionData({
    abi: engineHubABI,
    functionName: "multiCall",
    args: [
      [
        {
          target: tokenRouterReleaseIntentAddress,
          callData: tokenRouterReleaseClaimData,
        },
        {
          target: inputToken.address,
          callData: approveInputTokenData,
        },
        {
          target: uniV3SwapperAddress as `0x${string}`,
          callData: uniV3SwapData as `0x${string}`,
        },
      ],
    ],
  })

  // 1. Timestamp Intent == No Hook
  // 2. Token Release Intent == No Hook
  // 3. Limit Order Intent == Fill on Uniswap
  return [
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
    {
      target: ADDRESS_ZERO,
      data: "0x00",
    },
    {
      target: engineHubAddress,
      data: engineHubMulticallData,
    },
  ]
}
