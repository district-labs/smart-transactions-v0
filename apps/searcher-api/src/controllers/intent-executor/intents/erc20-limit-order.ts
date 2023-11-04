import { erc20ABI } from "@district-labs/intentify-abi-external"
import { type Address, type PublicClient } from "viem"

import { MULTICALL_WITH_FLASHLOAN_ADDRESS } from "../constants"
import { encodeMultiCallWithFlashLoanData } from "../utils"
import { routeSwapExactInput } from "../utils/uniswap/routing"

interface Erc20LimitOrderIntentInputs {
  tokenOut: Address
  tokenIn: Address
  amountOutMax: bigint
  amountInMin: bigint
  safeAddress: Address
}

export async function getHookErc20LimitOrderIntent(
  inputs: Erc20LimitOrderIntentInputs,
  publicClient: PublicClient
) {
  const { tokenOut, tokenIn, amountOutMax, amountInMin, safeAddress } = inputs

  // Check if the safe has enough tokenOut
  const tokenOutBalance = (await publicClient.readContract({
    address: tokenOut,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [safeAddress],
  })) as bigint | null

  if (!tokenOutBalance || tokenOutBalance < amountOutMax) {
    throw new Error(
      `Safe ${safeAddress} does not have enough ${tokenOut} to execute limit order`
    )
  }

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

  // Get the best uniswap route
  const route = await routeSwapExactInput({
    chainId: 1,
    amountIn: amountOutMax.toString(),
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

  if (quoteTokenIn < amountInMin) {
    throw new Error("Not able to execute limit order with current price")
  }

  const { to: uniV3SwapperAddress, calldata: uniV3SwapData } =
    route.methodParameters

  const hookData = encodeMultiCallWithFlashLoanData({
    flashLoanParams: {
      tokens: [tokenIn],
      amounts: [amountInMin],
    },
    multiCallParams: [[uniV3SwapperAddress, BigInt(0), uniV3SwapData]],
  })

  return hookData
}
