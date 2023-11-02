import { blockNumberIntentABI } from "@district-labs/intentify-core"
import { BlockNumberIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateBlockNumberRange } from "./validators"

const blockNumberRangeIntentEncodeABI = getAbiItem({
  abi: blockNumberIntentABI,
  name: "encodeIntent",
}).inputs

export type BlockNumberRangeIntentEncodeABI =
  typeof blockNumberRangeIntentEncodeABI

export const blockNumberRange = {
  name: "BlockNumberRange",
  deployed: BlockNumberIntent,
  validate: validateBlockNumberRange,
  abi: blockNumberRangeIntentEncodeABI,
} as const

export default blockNumberRange
