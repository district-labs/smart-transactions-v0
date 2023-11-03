import { encodeAbiParameters } from "viem"
import { expect, test } from "vitest"

import { chainlinkDataFeed } from "../chainlink-data-feed"
import {
  validateChainlinkDataFeed,
  type ValidateChainlinkDataFeedArgs,
} from "./validate-chainlink-data-feed"

const abi = chainlinkDataFeed.abi

const data = encodeAbiParameters(abi, [
  "0x0000000000000000000000000000000000000000",
  BigInt(900e8),
  BigInt(1100e8),
  BigInt(60),
])

test("valid chainlinkDataFeed", async () => {
  const args: ValidateChainlinkDataFeedArgs = {
    currentTimestamp: BigInt("1698927719"),
    dataFeedAnswer: BigInt(1000e8),
    dataFeedUpdatedAt: BigInt("1698927710"),
  }
  const result = await validateChainlinkDataFeed(abi, data, args)
  expect(result.status).toBe(true)
})

test("invalid minValue", async () => {
  const args: ValidateChainlinkDataFeedArgs = {
    currentTimestamp: BigInt("1698927719"),
    dataFeedAnswer: BigInt(800e8),
    dataFeedUpdatedAt: BigInt("1698927710"),
  }

  const result = await validateChainlinkDataFeed(abi, data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 0,
      msg: `minValue is 90000000000 but dataFeedAnswer is ${args.dataFeedAnswer}`,
    },
  ])
})

test("invalid maxValue", async () => {
  const args: ValidateChainlinkDataFeedArgs = {
    currentTimestamp: BigInt("1698927719"),
    dataFeedAnswer: BigInt(1200e8),
    dataFeedUpdatedAt: BigInt("1698927710"),
  }

  const result = await validateChainlinkDataFeed(abi, data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 1,
      msg: `maxValue is 110000000000 but dataFeedAnswer is ${args.dataFeedAnswer}`,
    },
  ])
})

test("invalid thresholdSeconds", async () => {
  const args: ValidateChainlinkDataFeedArgs = {
    currentTimestamp: BigInt("1698927719"),
    dataFeedAnswer: BigInt(1000e8),
    dataFeedUpdatedAt: BigInt("1698927610"),
  }

  const result = await validateChainlinkDataFeed(abi, data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 2,
      msg: `currentTimestamp is 1698927719 but dataFeedUpdatedAt + thresholdSeconds is 1698927670`,
    },
  ])
})
