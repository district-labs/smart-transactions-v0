import { erc20ABI } from "@district-labs/intentify-abi-external"
import { createPublicClient, encodeAbiParameters, http } from "viem"
import { mainnet } from "viem/chains"
import { expect, test } from "vitest"
import { erc20LimitOrder } from '@district-labs/intentify-intent-batch' 
import {
  validateErc20LimitOrder,
} from "./validate-erc20-limit-order"

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

test("valid erc20LimitOrder arguments", async () => {
  const args = {
    root: "0x000000000000000000000000000000000000dEaD" as `0x${string}`,
  }
  const TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC
  const TOKEN_IN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // WETH
  const dataBalanceTokenOut = await client.readContract({
    address: TOKEN_OUT,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [args.root],
  })

  const AMOUNT_OUT = dataBalanceTokenOut
  const AMOUNT_IN = 0

  const data = encodeAbiParameters(erc20LimitOrder.abi, [
    TOKEN_OUT,
    TOKEN_IN,
    AMOUNT_OUT,
    AMOUNT_IN,
  ])
  const result = await validateErc20LimitOrder(erc20LimitOrder.abi, data, args, client)
  expect(result.status).toBe(true)
})

test("invalid erc20LimitOrder arguments", async () => {
  const args = {
    root: "0x000000000000000000000000000000000000dEaD" as `0x${string}`,
  }
  const TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC
  const TOKEN_IN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // WETH
  const dataBalanceTokenOut = await client.readContract({
    address: TOKEN_OUT,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [args.root],
  })

  const AMOUNT_OUT = BigInt(dataBalanceTokenOut as bigint) + BigInt(1)
  const AMOUNT_IN = 0

  const data = encodeAbiParameters(erc20LimitOrder.abi, [
    TOKEN_OUT,
    TOKEN_IN,
    AMOUNT_OUT,
    AMOUNT_IN,
  ])
  const result = await validateErc20LimitOrder(erc20LimitOrder.abi, data, args, client)

  expect(result.status).toBe(false)
  expect(result.errors).toStrictEqual([
    {
      index: 2,
      msg: `amountOut is ${AMOUNT_OUT} but balanceOf is ${dataBalanceTokenOut}`,
    },
  ])
})
