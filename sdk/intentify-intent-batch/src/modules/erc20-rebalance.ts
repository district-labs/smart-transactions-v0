import { erc20RebalanceIntentABI } from "@district-labs/intentify-core"
import { Erc20RebalanceIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"


const erc20RebalanceIntentEncodeABI = getAbiItem({
  abi: erc20RebalanceIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc20RebalanceIntentEncodeABI =
  typeof erc20RebalanceIntentEncodeABI

export const erc20Rebalance = {
  name: "Erc20Rebalance",
  deployed: Erc20RebalanceIntent,
  abi: erc20RebalanceIntentEncodeABI,
} as const

export default erc20Rebalance
