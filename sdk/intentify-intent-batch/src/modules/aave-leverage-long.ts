import { aaveLeverageLongIntentABI } from "@district-labs/intentify-core"
import { AaveLeverageLongIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateAaveLeverageLong } from "./validators"

const aaveLeverageLongIntentEncodeABI = getAbiItem({
  abi: aaveLeverageLongIntentABI,
  name: "encodeIntent",
}).inputs

export type AaveLeverageLongIntentEncodeABI =
  typeof aaveLeverageLongIntentEncodeABI

export const aaveLeverageLong = {
  name: "AaveLeverageLong",
  deployed: AaveLeverageLongIntent,
  validate: validateAaveLeverageLong,
  abi: aaveLeverageLongIntentEncodeABI,
} as const

export default aaveLeverageLong
