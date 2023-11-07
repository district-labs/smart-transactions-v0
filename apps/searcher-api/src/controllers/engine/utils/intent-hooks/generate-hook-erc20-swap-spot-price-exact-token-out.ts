import {
  chainlinkDataFeedABI,
  erc20ABI,
} from "@district-labs/intentify-abi-external"
import type { Hook } from "@district-labs/intentify-core"
import type { DbIntent } from "@district-labs/intentify-database"
import { Erc20SwapSpotPriceExactTokenOutIntent } from "@district-labs/intentify-deployments"
import { Address, encodeAbiParameters, Hex, type PublicClient } from "viem"

import { intentArgsToObj } from ".."
import {
  getSearcherAddressBychainId,
  MULTICALL_WITH_FLASHLOAN_ADDRESS,
} from "../../../../constants"
import { encodeMultiCallWithFlashLoanData } from "../encode-multicall-with-flashloan"
import { routeSwapExactInput } from "./uniswap/routing"
import { erc20SwapSpotPriceExactTokenOutArgsSchema } from "./validations"

interface Erc20SwapSpotPriceExactTokenOutParams {
  chainId: number
  intent: DbIntent
  publicClient: PublicClient
}

const PRICE_FEED_DECIMALS = 10n ** 8n

export async function generateHookErc20SwapSpotPriceExactTokenOut({
  chainId,
  intent,
  publicClient,
}: Erc20SwapSpotPriceExactTokenOutParams): Promise<Hook> {
  const inputs = intentArgsToObj(intent.intentArgs)
  const {
    tokenOut,
    tokenIn,
    tokenOutPriceFeed,
    tokenInPriceFeed,
    tokenOutAmount,
  } = erc20SwapSpotPriceExactTokenOutArgsSchema.parse(inputs)

  const tokenOutAmountBigInt = BigInt(tokenOutAmount)

  const tokenOutDecimals = (await publicClient.readContract({
    address: tokenOut as Address,
    abi: erc20ABI, 
    functionName: "decimals",
  })) 

  const tokenInDecimals = (await publicClient.readContract({
    address: tokenIn as Address,
    abi: erc20ABI,
    functionName: "decimals",
  })) 

  const [, tokenOutPrice, , ,] = (await publicClient.readContract({
    address: tokenOutPriceFeed as Address,
    abi: chainlinkDataFeedABI,
    functionName: "latestRoundData",
  })) 

  const [, tokenInPrice, , ,] = (await publicClient.readContract({
    address: tokenInPriceFeed as Address,
    abi: chainlinkDataFeedABI,
    functionName: "latestRoundData",
  })) 

  const tokenOutPriceInTokenIn =
    (tokenInPrice * PRICE_FEED_DECIMALS) / tokenOutPrice

  const tokenInAmount =
    (tokenOutAmountBigInt *
      tokenOutPriceInTokenIn *
      10n ** BigInt(tokenInDecimals - tokenOutDecimals)) /
    PRICE_FEED_DECIMALS

  // Check if the safe has enough tokenOut
  const tokenOutBalance = (await publicClient.readContract({
    address: tokenOut as Address,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [intent.root as Address],
  })) as bigint | null

  if (!tokenOutBalance || tokenOutBalance < tokenOutAmountBigInt) {
    throw new Error(
      `Safe ${intent.root} does not have enough ${tokenOut} to execute limit order`
    )
  }

  // Get the best uniswap route
  const route = await routeSwapExactInput({
    chainId,
    amountIn: tokenOutAmount.toString(),
    inputToken: {
      address: tokenOut as Address,
      decimals: Number(tokenOutDecimals),
    },
    outputToken: {
      address: tokenIn as Address,
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
      tokens: [tokenIn as Address],
      amounts: [tokenInAmount],
    },
    multiCallParams: [
      {
        target:uniV3SwapperAddress as Address, value: BigInt(0), callData: uniV3SwapData as Hex}],
  })

  const hookInstructions = encodeAbiParameters(
    [{ name: 'executor', type: 'address' }],
    [getSearcherAddressBychainId(chainId)]
  )

  const hook: Hook = {
    target: Erc20SwapSpotPriceExactTokenOutIntent[chainId],
    data: hookData,
    instructions: hookInstructions,
  }

  return hook
}
