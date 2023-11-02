import { ethTipIntentABI } from "@district-labs/intentify-core"
import { EthTipIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

const ethTipIntentEncodeABI = getAbiItem({
  abi: ethTipIntentABI,
  name: "encodeIntent",
}).inputs

export type EthTipIntentEncodeABI = typeof ethTipIntentEncodeABI

export const ethTip = {
  name: "EthTip",
  deployed: EthTipIntent,
  abi: ethTipIntentEncodeABI,
} as const

export default ethTip
