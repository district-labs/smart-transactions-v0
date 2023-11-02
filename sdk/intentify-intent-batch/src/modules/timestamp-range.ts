import { timestampIntentABI } from "@district-labs/intentify-core"
import { TimestampRangeIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateTimestampRange } from "./validators"

const timestampRangeIntentEncodeABI = getAbiItem({
  abi: timestampIntentABI,
  name: "encodeIntent",
}).inputs

export type TimestampRangeIntentEncodeABI = typeof timestampRangeIntentEncodeABI

export const timestampRange = {
  name: "TimestampRange",
  deployed: TimestampRangeIntent,
  validate: validateTimestampRange,
  abi: timestampRangeIntentEncodeABI,
} as const

export default timestampRange
