import { encodeAbiParameters } from "viem"
import { expect, test } from "vitest"

import {
  blockNumberRange,
  validateBlockNumberRange,
} from "./validate-block-number-range"

test("valid blockNumberRange", () => {
  const data = encodeAbiParameters(blockNumberRange.args, [1, 10])
  const args = {
    currentTimestamp: BigInt(5),
  }
  const result = validateBlockNumberRange(data, args)
  expect(result.status).toBe(true)
})

test("invalid minBlockNumber", () => {
  const data = encodeAbiParameters(blockNumberRange.args, [2, 10])
  const args = {
    currentTimestamp: BigInt(1),
  }
  const result = validateBlockNumberRange(data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 0,
      msg: `minBlockNumber is 2 but current blockNumber is 1`,
    },
  ])
})

test("invalid maxBlockNumber", () => {
  const data = encodeAbiParameters(blockNumberRange.args, [2, 10])
  const args = {
    currentTimestamp: BigInt(12),
  }
  const result = validateBlockNumberRange(data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 1,
      msg: `maxBlockNumber is 10 but current blockNumber is 12`,
    },
  ])
})
