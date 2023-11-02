import { erc20LimitOrderIntentABI } from "@district-labs/intentify-core"
import { Erc20LimitOrderIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateErc20LimitOrder } from "./validators"

const erc20LimitOrderIntentEncodeABI = getAbiItem({
  abi: erc20LimitOrderIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc20LimitOrderIntentEncodeABI =
  typeof erc20LimitOrderIntentEncodeABI

export const erc20LimitOrder = {
  name: "Erc20LimitOrder",
  deployed: Erc20LimitOrderIntent,
  validate: validateErc20LimitOrder,
  abi: erc20LimitOrderIntentEncodeABI,
} as const

export default erc20LimitOrder
