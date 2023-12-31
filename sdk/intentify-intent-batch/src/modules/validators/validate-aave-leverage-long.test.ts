import { erc20ABI } from "@district-labs/intentify-abi-external"
import { createPublicClient, encodeAbiParameters, http } from "viem"
import { mainnet } from "viem/chains"
import { expect, test } from "vitest"

import { aaveLeverageLong } from "../aave-leverage-long"
import {
  validateAaveLeverageLong,
  type ValidateAaveLeverageLongArgs,
} from "./validate-aave-leverage-long"

const abi = aaveLeverageLong.abi

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

test("valid aaveLeverageLong arguments", async () => {
  const args: ValidateAaveLeverageLongArgs = {
    root: "0x122e2cD153a58BA06c79EF0384D6A696a93D0ab6",
    aaveV3Pool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    publicClient: client,
  }
  const TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC
  const TOKEN_IN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // WETH
  const dataBalanceTokenOut = await client.readContract({
    address: TOKEN_OUT,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [args.root],
  })

  const INTEREST_RATE_MODE = dataBalanceTokenOut
  const MIN_HEALTH_FACTOR = BigInt(1e18)
  const FEE = 0

  const data = encodeAbiParameters(abi, [
    TOKEN_OUT,
    TOKEN_IN,
    INTEREST_RATE_MODE,
    MIN_HEALTH_FACTOR,
    FEE,
  ])
  const result = await validateAaveLeverageLong(abi, data, args)
  expect(result.status).toBe(true)
})

test("invalid aaveLeverageLong arguments", async () => {
  const args: ValidateAaveLeverageLongArgs = {
    root: "0x000000000000000000000000000000000000dEaD",
    aaveV3Pool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    publicClient: client,
  }
  const TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC
  const TOKEN_IN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // WETH
  const dataBalanceTokenOut = await client.readContract({
    address: TOKEN_OUT,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [args.root],
  })

  const INTEREST_RATE_MODE = BigInt(dataBalanceTokenOut) + BigInt(1)
  const MIN_HEALTH_FACTOR = BigInt(0)
  const FEE = 0

  const data = encodeAbiParameters(abi, [
    TOKEN_OUT,
    TOKEN_IN,
    INTEREST_RATE_MODE,
    MIN_HEALTH_FACTOR,
    FEE,
  ])
  const result = await validateAaveLeverageLong(abi, data, args)

  expect(result.status).toBe(false)
  expect(result.errors).toStrictEqual([
    {
      index: -1,
      msg: `root does not have a Aave V3 account`,
    },
  ])
})
