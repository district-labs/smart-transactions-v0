import { encodeAbiParameters } from "viem"
import { expect, test } from "vitest"

import { blockNumberRange } from "../block-number-range"
import {
  validateBlockNumberRange,
  type ValidateBlockNumberRangeArgs,
} from "./validate-block-number-range"

const abi = blockNumberRange.abi

test("valid blockNumberRange", async () => {
  const data = encodeAbiParameters(abi, [BigInt(1), BigInt(10)])
  const args: ValidateBlockNumberRangeArgs = {
    currentBlockNumber: BigInt(5),
  }
  const result = await validateBlockNumberRange(abi, data, args)
  expect(result.status).toBe(true)
})

test("invalid minBlockNumber", async () => {
  const data = encodeAbiParameters(abi, [BigInt(2), BigInt(10)])
  const args: ValidateBlockNumberRangeArgs = {
    currentBlockNumber: BigInt(1),
  }
  const result = await validateBlockNumberRange(abi, data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 0,
      msg: `minBlockNumber is 2 but current blockNumber is 1`,
    },
  ])
})

test("invalid maxBlockNumber", async () => {
  const data = encodeAbiParameters(abi, [BigInt(2), BigInt(10)])
  const args: ValidateBlockNumberRangeArgs = {
    currentBlockNumber: BigInt(12),
  }
  const result = await validateBlockNumberRange(abi, data, args)
  expect(result.status).toBe(false)
  expect(result.errors).toEqual([
    {
      index: 1,
      msg: `maxBlockNumber is 10 but current blockNumber is 12`,
    },
  ])
})
