import { encodeAbiParameters } from "viem"
import { expect, test } from "vitest"
import {
  validateTimestampRange,
} from "./validate-timestamp-range"

const abi  = [
  {
    name: "start",
    type: "uint128",
  },
  {
    name: "end",
    type: "uint128",
  },
]

test("valid timestamp range", async () => {
  const data = encodeAbiParameters(abi, [1, 10])
  const args = {
    currentTimestamp: BigInt(5),
  }
  const result = await validateTimestampRange(abi, data, args)
  expect(result.status).toBe(true)
})

test("invalid minTimestamp", async () => {
  const data = encodeAbiParameters(abi, [2, 10])
  const args = {
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
  const data = encodeAbiParameters(abi, [2, 10])
  const args = {
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
