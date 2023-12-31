import { encodeAbiParameters } from "viem"
import { expect, test } from "vitest"

import { timestampRange } from "../timestamp-range"
import {
  validateTimestampRange,
  type ValidateTimestampRangeArgs,
} from "./validate-timestamp-range"

const abi = timestampRange.abi

test("valid timestamp range", async () => {
  const data = encodeAbiParameters(abi, [BigInt(1), BigInt(10)])
  const args: ValidateTimestampRangeArgs = {
    currentTimestamp: BigInt(5),
  }
  const result = await validateTimestampRange(abi, data, args)
  expect(result.status).toBe(true)
})

test("invalid minTimestamp", async () => {
  const data = encodeAbiParameters(abi, [BigInt(2), BigInt(10)])
  const args: ValidateTimestampRangeArgs = {
    currentTimestamp: BigInt(1),
  }
  const result = await validateTimestampRange(abi, data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 0,
      msg: `minTimestamp is 2 but current timestamp is 1`,
    },
  ])
})

test("invalid maxTimestamp", async () => {
  const data = encodeAbiParameters(abi, [BigInt(2), BigInt(10)])
  const args: ValidateTimestampRangeArgs = {
    currentTimestamp: BigInt(12),
  }
  const result = await validateTimestampRange(abi, data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 1,
      msg: `maxTimestamp is 10 but current timestamp is 12`,
    },
  ])
})
