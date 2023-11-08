import { isAddress } from "viem"
import { z } from "zod"

const stringAddress = z.string().refine((val) => isAddress(val))
const stringBigInt = z.string().refine((val) => BigInt(val) > 0n)

export const erc20LimitOrderIntentArgsSchema = z.object({
  tokenOut: stringAddress,
  tokenIn: stringAddress,
  amountOutMax: stringBigInt,
  amountInMin: stringBigInt,
})

export const erc20SwapSpotPriceExactTokenInArgsSchema = z.object({
  tokenOut: stringAddress,
  tokenIn: stringAddress,
  tokenOutPriceFeed: stringAddress,
  tokenInPriceFeed: stringAddress,
  tokenInAmount: stringBigInt,
  thresholdSeconds: stringBigInt,
})

export const erc20SwapSpotPriceExactTokenOutArgsSchema = z.object({
  tokenOut: stringAddress,
  tokenIn: stringAddress,
  tokenOutPriceFeed: stringAddress,
  tokenInPriceFeed: stringAddress,
  tokenOutAmount: stringBigInt,
  thresholdSeconds: stringBigInt,
})

export const erc20SwapSpotPriceBalanceTokenOutArgsSchema = z.object({
  tokenOut: stringAddress,
  tokenIn: stringAddress,
  tokenOutPriceFeed: stringAddress,
  tokenInPriceFeed: stringAddress,
  thresholdSeconds: stringBigInt,
  minBalance: stringBigInt,
  balanceDelta: stringBigInt,
})
