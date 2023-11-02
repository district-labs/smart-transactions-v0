import { erc20TipIntentABI } from "@district-labs/intentify-core"
import { Erc20TipIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

const erc20TipIntentEncodeABI = getAbiItem({
  abi: erc20TipIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc20TipIntentEncodeABI = typeof erc20TipIntentEncodeABI

export const erc20TipIntent = {
  name: "EthTip",
  deployed: Erc20TipIntent,
  abi: erc20TipIntentEncodeABI,
} as const

export default erc20TipIntent
