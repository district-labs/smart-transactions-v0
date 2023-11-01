import { encodeAbiParameters } from "viem"
import { expect, test } from "vitest"
import {
  validateBlockNumberRange,
} from "./validate-block-number-range"

const abi = [
  {
    name: "start",
    type: "uint128",
  },
  {
    name: "end",
    type: "uint128",
  },
]

test("valid blockNumberRange", async () => {
  const data = encodeAbiParameters(abi, [1, 10])
  const args = {
    currentBlockNumber: BigInt(5),
  }
  const result = await validateBlockNumberRange(abi, data, args)
  expect(result.status).toBe(true)
})

test("invalid minBlockNumber", async () => {
  const data = encodeAbiParameters(abi, [2, 10])
  const args = {
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
  const data = encodeAbiParameters(abi, [2, 10])
  const args = {
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
