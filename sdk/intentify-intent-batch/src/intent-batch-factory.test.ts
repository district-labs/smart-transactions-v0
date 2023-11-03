import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import { expect, test } from "vitest"

import { IntentBatchFactory } from "./intent-batch-factory"
import { intentModulesDefault } from "./intent-modules-default"

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

test("encode module arguments from intent batch factory", () => {
  const intentBatchFactory = new IntentBatchFactory(intentModulesDefault)
  const result = intentBatchFactory.encode("TimestampRange", ["1", "2"])
  expect(result).toBe(
    "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002"
  )
})

test("encode module arguments from intent batch manager", () => {
  const intentBatchFactory = new IntentBatchFactory(intentModulesDefault)
  const intentBatch = intentBatchFactory.create(
    5,
    "0x000000000000000000000000000000000000dEaD"
  )
  const result = intentBatch.add("TimestampRange", ["1", "2"])
  expect(result).toBe(
    "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002"
  )
})

test("generate intent batch", () => {
  const intentBatchFactory = new IntentBatchFactory(intentModulesDefault)
  const intentBatch = intentBatchFactory.create(
    5,
    "0x000000000000000000000000000000000000dEaD"
  )

  intentBatch.nonce("standard", ["1"])
  intentBatch.add("TimestampRange", ["1", "2"])

  expect(intentBatch.generate()).toEqual({
    intents: [
      {
        data: "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002",
        root: "0x000000000000000000000000000000000000dEaD",
        target: "0x200000000000000000000000000000000000dEaD",
        value: BigInt(0),
      },
    ],
    nonce: "0x0000000000000000000000000000000000000000000000000000000000000001",
    root: "0x000000000000000000000000000000000000dEaD",
  })
})

test("validate intent batch using override values", async () => {
  const intentBatchFactory = new IntentBatchFactory(intentModulesDefault)
  const intentBatch = intentBatchFactory.create(
    5,
    "0x000000000000000000000000000000000000dEaD"
  )

  intentBatch.nonce("standard", ["1"])
  intentBatch.add("TimestampRange", ["1", "5"])
  const validationArguments = [
    {
      name: "TimestampRange",
      args: {
        currentTimestamp: 3,
      },
    },
  ]

  const intentBatchGenerated = intentBatch.generate()
  const validation = await intentBatchFactory.validate(
    intentBatchGenerated,
    1,
    validationArguments
  )
  expect(validation).toEqual([
    {
      name: "TimestampRange",
      results: {
        status: true,
      },
    },
  ])
})

test("validate intent batch using live values", async () => {
  const intentBatchFactory = new IntentBatchFactory(intentModulesDefault, {
    1: client,
  })
  const intentBatch = intentBatchFactory.create(
    5,
    "0x000000000000000000000000000000000000dEaD"
  )
  intentBatch.nonce("standard", ["1"])
  intentBatch.add("TimestampRange", ["1", "99999999999"])
  const intentBatchGenerated = intentBatch.generate()
  const validation = await intentBatchFactory.validate(intentBatchGenerated, 1)
  expect(validation).toEqual([
    {
      name: "TimestampRange",
      results: {
        status: true,
      },
    },
  ])
})

test("invalidate intent batch using live values", async () => {
  const intentBatchFactory = new IntentBatchFactory(intentModulesDefault, {
    1: client,
  })
  const intentBatch = intentBatchFactory.create(
    5,
    "0x000000000000000000000000000000000000dEaD"
  )

  intentBatch.nonce("standard", ["1"])
  intentBatch.add("TimestampRange", ["1", "10"])

  const intentBatchGenerated = intentBatch.generate()
  const validation = await intentBatchFactory.validate(intentBatchGenerated, 1)
  expect(validation[0].results.status).toEqual(false)
})

test("generate and decode intent batch", () => {
  const intentBatchFactory = new IntentBatchFactory(intentModulesDefault)
  const intentBatch = intentBatchFactory.create(
    5,
    "0x000000000000000000000000000000000000dEaD"
  )

  intentBatch.nonce("standard", ["1"])
  intentBatch.add("TimestampRange", ["1", "2"])
  const intentBatchData = intentBatch.generate()
  const decodedIntentBatch =
    intentBatchFactory.decodeIntentBatch(intentBatchData)
  expect(decodedIntentBatch).toEqual([
    {
      intentArgs: [
        {
          name: "start",
          type: "uint128",
          value: "1",
        },
        {
          name: "end",
          type: "uint128",
          value: "2",
        },
      ],
      intentId:
        "0x3b91d3061a2a1688f16733114d74bb6f4a298f7f3d9da0207c2ff3036a8d0c0a",
      name: "TimestampRange",
      root: "0x000000000000000000000000000000000000dEaD",
      target: "0x200000000000000000000000000000000000dEaD",
      data: "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002",
      value: BigInt(0),
    },
  ])
})
