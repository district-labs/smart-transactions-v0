import { aaveV3SupplyBalanceContinualIntentABI } from "@district-labs/intentify-core"
import { AaveV3SupplyBalanceContinualIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateAaveV3SupplyBalanceContinual } from "./validators"

const aaveV3SupplyBalanceContinualIntentEncodeABI = getAbiItem({
  abi: aaveV3SupplyBalanceContinualIntentABI,
  name: "encodeIntent",
}).inputs

export type AaveV3SupplyBalanceContinualIntentEncodeABI =
  typeof aaveV3SupplyBalanceContinualIntentEncodeABI

export const aaveV3SupplyBalanceContinual = {
  name: "AaveV3SupplyBalanceContinual",
  deployed: AaveV3SupplyBalanceContinualIntent,
  validate: validateAaveV3SupplyBalanceContinual,
  abi: aaveV3SupplyBalanceContinualIntentEncodeABI,
} as const

export default aaveV3SupplyBalanceContinual
