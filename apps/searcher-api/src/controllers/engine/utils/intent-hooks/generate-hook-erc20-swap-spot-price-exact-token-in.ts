import {
  chainlinkDataFeedABI,
  erc20ABI,
  erc20MintableABI,
} from "@district-labs/intentify-abi-external"
import type { Hook } from "@district-labs/intentify-core"
import type { DbIntent } from "@district-labs/intentify-database"
import {
  Erc20SwapSpotPriceExactTokenInIntent,
  TEST_TOKENS_LIST,
} from "@district-labs/intentify-deployments"
import {
  encodeAbiParameters,
  encodeFunctionData,
  type Address,
  type Hex,
  type PublicClient,
} from "viem"

import { intentArgsToObj } from ".."
import {
  getSearcherAddressBychainId,
  MULTICALL_WITH_FLASHLOAN_ADDRESS,
} from "../../../../constants"
import { encodeMultiCallWithFlashLoanData } from "../encode-multicall-with-flashloan"
import { routeSwapExactInput } from "./uniswap/routing"
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

  // Check if the tokenIn is a test mintable token
  const isTestMintableToken = TEST_TOKENS_LIST.some(
    (testToken) => testToken[chainId] === tokenIn
  )

  // If it is a test mintable token, mint the tokenInAmount to the user
  if (isTestMintableToken) {
    const mintTokenData = encodeFunctionData({
      abi: erc20MintableABI,
      functionName: "mint",
      args: [intent.root as Address, tokenInAmountBigInt],
    })

    const hook: Hook = {
      target: tokenIn as Address,
      data: mintTokenData,
      instructions: encodeAbiParameters(
        [{ name: "executor", type: "address" }],
        [getSearcherAddressBychainId(chainId)]
      ),
    }

    return hook
  } else {
    // If it is not a test mintable token, Perform a flashloan to get the tokenInAmount and do a swap

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

    const { to: uniV3SwapperAddress, calldata: uniV3SwapData } =
      route.methodParameters

    const hookData = encodeMultiCallWithFlashLoanData({
      flashLoanParams: {
        tokens: [tokenIn as Address],
        amounts: [tokenInAmountBigInt],
      },
      multiCallParams: [
        {
          target: uniV3SwapperAddress as Address,
          value: BigInt(0),
          callData: uniV3SwapData as Hex,
        },
      ],
    })

    const hookInstructions = encodeAbiParameters(
      [{ name: "executor", type: "address" }],
      [getSearcherAddressBychainId(chainId)]
    )

    const hook: Hook = {
      target: Erc20SwapSpotPriceExactTokenInIntent[chainId],
      data: hookData,
      instructions: hookInstructions,
    }

    return hook
  }
}
