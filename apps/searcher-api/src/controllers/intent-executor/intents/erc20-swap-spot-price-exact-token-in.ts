import {
  chainlinkDataFeedABI,
  erc20ABI,
} from "@district-labs/intentify-abi-external"
import { type Address, type PublicClient } from "viem"

import { MULTICALL_WITH_FLASHLOAN_ADDRESS } from "../constants"
import { encodeMultiCallWithFlashLoanData } from "../utils"
import { routeSwapExactInput } from "../utils/uniswap/routing"

interface Erc20SwapSpotPriceExactTokenIn {
  tokenOut: Address
  tokenIn: Address
  tokenOutPriceFeed: Address
  tokenInPriceFeed: Address
  tokenInAmount: bigint
  thresholdSeconds: bigint
  safeAddress: Address
}

const PRICE_FEED_DECIMALS = 10n ** 8n

export async function getHookErc20SwapSpotPriceExactTokenIn(
  inputs: Erc20SwapSpotPriceExactTokenIn,
  publicClient: PublicClient
) {
  const {
    tokenOut,
    tokenIn,
    tokenInAmount,
    tokenInPriceFeed,
    tokenOutPriceFeed,
    safeAddress,
  } = inputs

  const tokenOutDecimals = (await publicClient.readContract({
    address: tokenOut,
    abi: erc20ABI,
    functionName: "decimals",
  })) as bigint

  const tokenInDecimals = (await publicClient.readContract({
    address: tokenIn,
    abi: erc20ABI,
    functionName: "decimals",
  })) as bigint

  const [, tokenOutPrice, , ,] = (await publicClient.readContract({
    address: tokenOutPriceFeed,
    abi: chainlinkDataFeedABI,
    functionName: "latestRoundData",
  })) as [bigint, bigint, bigint, bigint, bigint]

  const [, tokenInPrice, , ,] = (await publicClient.readContract({
    address: tokenInPriceFeed,
    abi: chainlinkDataFeedABI,
    functionName: "latestRoundData",
  })) as [bigint, bigint, bigint, bigint, bigint]

  const tokenOutPriceInTokenOut =
    (tokenInPrice * PRICE_FEED_DECIMALS) / tokenOutPrice

  const tokenOutAmount =
    (tokenInAmount *
      tokenOutPriceInTokenOut *
      10n ** (tokenOutDecimals - tokenInDecimals)) /
    PRICE_FEED_DECIMALS

  // Check if the safe has enough tokenOut
  const tokenOutBalance = (await publicClient.readContract({
    address: tokenOut,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [safeAddress],
  })) as bigint | null

  if (!tokenOutBalance || tokenOutBalance < tokenOutAmount) {
    throw new Error(
      `Safe ${safeAddress} does not have enough ${tokenOut} to execute limit order`
    )
  }

  // Get the best uniswap route
  const route = await routeSwapExactInput({
    chainId: 1,
    amountIn: tokenOutAmount.toString(),
    inputToken: {
      address: tokenOut,
      decimals: Number(tokenOutDecimals),
    },
    outputToken: {
      address: tokenIn,
      decimals: Number(tokenInDecimals),
    },
    recipient: MULTICALL_WITH_FLASHLOAN_ADDRESS,
  })

  if (!route?.methodParameters) throw new Error("route not found")

  // Get the quote from the optimal route
  const quoteTokenIn = BigInt(route.quote.toExact())

  if (quoteTokenIn < tokenInAmount) {
    throw new Error("Not able to execute ERC20 swap order with current price")
  }

  const { to: uniV3SwapperAddress, calldata: uniV3SwapData } =
    route.methodParameters

  const hookData = encodeMultiCallWithFlashLoanData({
    flashLoanParams: {
      tokens: [tokenIn],
      amounts: [tokenInAmount],
    },
    multiCallParams: [[uniV3SwapperAddress, BigInt(0), uniV3SwapData]],
  })

  return hookData
}
