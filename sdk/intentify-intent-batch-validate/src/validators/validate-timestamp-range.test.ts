import { encodeAbiParameters } from "viem"
import { expect, test } from "vitest"

import {
  timestampRange,
  validateTimestampRange,
} from "./validate-timestamp-range"

test("valid timestamp range", () => {
  const data = encodeAbiParameters(timestampRange.args, [1, 10])
  const args = {
    currentTimestamp: BigInt(5),
  }
  const result = validateTimestampRange(data, args)
  expect(result.status).toBe(true)
})

test("invalid minTimestamp", () => {
  const data = encodeAbiParameters(timestampRange.args, [2, 10])
  const args = {
    currentTimestamp: BigInt(1),
  }
  const result = validateTimestampRange(data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 0,
      msg: `minTimestamp is 2 but current timestamp is 1`,
    },
  ])
})

test("invalid maxTimestamp", () => {
  const data = encodeAbiParameters(timestampRange.args, [2, 10])
  const args = {
    currentTimestamp: BigInt(12),
  }
  const result = validateTimestampRange(data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 1,
      msg: `maxTimestamp is 10 but current timestamp is 12`,
    },
  ])
})
