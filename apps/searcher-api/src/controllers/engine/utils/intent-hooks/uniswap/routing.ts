import {
  CurrencyAmount,
  Percent,
  TradeType,
  Token as UniV3Token,
} from "@uniswap/sdk-core"
import {
  AlphaRouter,
  SwapType,
  type SwapOptionsSwapRouter02,
} from "@uniswap/smart-order-router"
import { ethers } from "ethers"
import { type Address } from "viem"
import { env } from "../../../../../env"

interface Token {
  address: Address
  decimals: number
}

interface RouteSwapExactOutputParams {
  chainId: number
  recipient: string
  amountOut: string
  inputToken: Token
  outputToken: Token
}

export async function routeSwapExactOutput({
  chainId,
  amountOut,
  inputToken,
  outputToken,
  recipient,
}: RouteSwapExactOutputParams) {
  const router = new AlphaRouter({
    chainId,
    provider: new ethers.providers.JsonRpcProvider(env.GOERLI_RPC_URL),
  })

  const inputTokenUniV3 = new UniV3Token(
    chainId,
    inputToken.address,
    inputToken.decimals
  )

  const outputTokenUniV3 = new UniV3Token(
    chainId,
    outputToken.address,
    outputToken.decimals
  )

  const options: SwapOptionsSwapRouter02 = {
    recipient,
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  }

  const route = await router.route(
    CurrencyAmount.fromRawAmount(outputTokenUniV3, amountOut),
    inputTokenUniV3,
    TradeType.EXACT_OUTPUT,
    options
  )

  return route
}

interface RouteSwapExactInputParams {
  chainId: number
  recipient: string
  amountIn: string
  inputToken: Token
  outputToken: Token
}

export async function routeSwapExactInput({
  chainId,
  amountIn,
  inputToken,
  outputToken,
  recipient,
}: RouteSwapExactInputParams) {
  const router = new AlphaRouter({
    chainId,
    provider: new ethers.providers.JsonRpcProvider(env.GOERLI_RPC_URL),
  })

  const inputTokenUniV3 = new UniV3Token(
    chainId,
    inputToken.address,
    inputToken.decimals
  )

  const outputTokenUniV3 = new UniV3Token(
    chainId,
    outputToken.address,
    outputToken.decimals
  )

  const options: SwapOptionsSwapRouter02 = {
    recipient,
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  }

  const route = await router.route(
    CurrencyAmount.fromRawAmount(inputTokenUniV3, amountIn),
    outputTokenUniV3,
    TradeType.EXACT_INPUT,
    options
  )

  return route
}
