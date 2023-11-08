import {
  erc20ABI,
  erc20MintableABI,
} from "@district-labs/intentify-abi-external"
import type { Hook } from "@district-labs/intentify-core"
import {
  Erc20LimitOrderIntent,
  TEST_TOKENS_LIST,
} from "@district-labs/intentify-deployments"
import {
  encodeAbiParameters,
  encodeFunctionData,
  type Address,
  type Hex,
  type PublicClient,
} from "viem"

import {
  getSearcherAddressBychainId,
} from "../../../../../constants"
import {
  env
} from "../../../../../env"
import { routeSwapExactInput } from "../uniswap/routing"
import { encodeMultiCallWithFlashLoanData } from "./encode-multicall-with-flashloan"

interface GenerateHookErc20SwapParams {
  chainId: number
  tokenIn: Address
  tokenOut: Address
  amountIn: bigint
  amountOut: bigint
  intentRoot: Address
  publicClient: PublicClient
}
/**
 * Generate a hook for a generic ERC20 swap
 */
export async function generateHookErc20Swap({
  chainId,
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  intentRoot,
  publicClient,
}: GenerateHookErc20SwapParams) {
  // Check if the tokenIn is a test mintable token
  const isTestMintableToken = TEST_TOKENS_LIST.some(
    (testToken) => testToken[chainId] === tokenIn
  )

  // If it is a test mintable token, mint the amountInMin to the user
  if (isTestMintableToken) {
    const mintTokenData = encodeFunctionData({
      abi: erc20MintableABI,
      functionName: "mint",
      args: [intentRoot, amountIn],
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
    // If it is not a test mintable token, Perform a flashloan to get the amountInMin and do a swap
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

    // Get the best uniswap route
    const route = await routeSwapExactInput({
      chainId,
      amountIn: amountOut.toString(),
      inputToken: {
        address: tokenOut as Address,
        decimals: Number(tokenOutDecimals),
      },
      outputToken: {
        address: tokenIn as Address,
        decimals: Number(tokenInDecimals),
      },
      recipient: env.MULTICALL_WITH_FLASHLOAN_ADDRESS,
    })

    if (!route?.methodParameters) throw new Error("route not found")

    // Get the quote from the optimal route
    const quoteTokenIn = BigInt(route.quote.toExact())

    if (quoteTokenIn < amountIn) {
      throw new Error("Not able to execute limit order with current price")
    }

    const { to: uniV3SwapperAddress, calldata: uniV3SwapData } =
      route.methodParameters

    const hookData = encodeMultiCallWithFlashLoanData({
      flashLoanParams: {
        tokens: [tokenIn as Address],
        amounts: [amountIn],
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
      target: Erc20LimitOrderIntent[chainId],
      data: hookData,
      instructions: hookInstructions,
    }

    return hook
  }
}
