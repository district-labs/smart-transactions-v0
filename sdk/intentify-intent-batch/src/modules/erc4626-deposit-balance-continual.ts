import { erc4626DepositBalanceContinualIntentABI } from "@district-labs/intentify-core"
import { Erc4626DepositBalanceContinualIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateErc4626DepositBalanceContinual } from "./validators/validate-erc4626-deposit-balance-continual"

const erc4626DepositBalanceContinualIntentEncodeABI = getAbiItem({
  abi: erc4626DepositBalanceContinualIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc4626DepositBalanceContinualIntentEncodeABI =
  typeof erc4626DepositBalanceContinualIntentEncodeABI

export const erc4626DepositBalanceContinual = {
  name: "Erc4626DepositBalanceContinual",
  deployed: Erc4626DepositBalanceContinualIntent,
  validate: validateErc4626DepositBalanceContinual,
  abi: erc4626DepositBalanceContinualIntentEncodeABI,
} as const

export default erc4626DepositBalanceContinual
