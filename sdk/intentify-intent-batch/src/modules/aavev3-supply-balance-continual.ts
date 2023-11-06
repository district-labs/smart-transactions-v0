import { aaveV3SupplyBalanceContinualIntentABI } from "@district-labs/intentify-core"
import { AaveV3SupplyBalanceContinualIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

const aaveV3SupplyBalanceContinualEncodeABI = getAbiItem({
  abi: aaveV3SupplyBalanceContinualIntentABI,
  name: "encodeIntent",
}).inputs

export type AaveV3SupplyBalanceContinualEncodeABI =
  typeof aaveV3SupplyBalanceContinualEncodeABI

export const aaveV3SupplyBalanceContinual = {
  name: "AaveV3SupplyBalanceContinual",
  deployed: AaveV3SupplyBalanceContinualIntent,
  abi: aaveV3SupplyBalanceContinualEncodeABI,
} as const

export default aaveV3SupplyBalanceContinual
