import {
  chainlinkDataFeedABI,
  erc20ABI,
} from "@district-labs/intentify-abi-external"
import type { Hook } from "@district-labs/intentify-core"
import type { DbIntent } from "@district-labs/intentify-database"
import { type Address, type PublicClient } from "viem"

import { intentArgsToObj } from ".."
import { generateHookErc20Swap } from "./utils/generate-hook-erc20-swap"
import { erc20SwapSpotPriceExactTokenInArgsSchema } from "./validations"

interface Erc20SwapSpotPriceExactTokenInParams {
  chainId: number
  intent: DbIntent
  publicClient: PublicClient
}

const PRICE_FEED_DECIMALS = 10n ** 8n

export async function generateHookErc20SwapSpotPriceExactTokenIn({
  chainId,
  intent,
  publicClient,
}: Erc20SwapSpotPriceExactTokenInParams): Promise<Hook> {
  const inputs = intentArgsToObj(intent.intentArgs)
  const {
    tokenOut,
    tokenIn,
    tokenOutPriceFeed,
    tokenInPriceFeed,
    tokenInAmount,
  } = erc20SwapSpotPriceExactTokenInArgsSchema.parse(inputs)

  const tokenInAmountBigInt = BigInt(tokenInAmount)

  const tokenOutDecimals = await publicClient.readContract({
    address: tokenOut as Address,
    abi: erc20ABI,
    functionName: "decimals",
  })

  const tokenInDecimals = await publicClient.readContract({
    address: tokenIn as Address,
    abi: erc20ABI,
    functionName: "decimals",
  })

  const [, tokenOutPrice, , ,] = await publicClient.readContract({
    address: tokenOutPriceFeed as Address,
    abi: chainlinkDataFeedABI,
    functionName: "latestRoundData",
  })

  const [, tokenInPrice, , ,] = await publicClient.readContract({
    address: tokenInPriceFeed as Address,
    abi: chainlinkDataFeedABI,
    functionName: "latestRoundData",
  })

  const tokenOutPriceInTokenOut =
    (tokenInPrice * PRICE_FEED_DECIMALS) / tokenOutPrice

  const tokenOutAmount =
    (tokenInAmountBigInt *
      tokenOutPriceInTokenOut *
      10n ** BigInt(tokenOutDecimals - tokenInDecimals)) /
    PRICE_FEED_DECIMALS

  const tokenOutAmountBigInt = BigInt(tokenOutAmount)

  const hook = generateHookErc20Swap({
    chainId,
    publicClient,
    tokenIn: tokenIn as Address,
    tokenOut: tokenOut as Address,
    amountIn: tokenInAmountBigInt,
    amountOut: tokenOutAmountBigInt,
    intentRoot: intent.root as Address,
  })

  return hook
}
