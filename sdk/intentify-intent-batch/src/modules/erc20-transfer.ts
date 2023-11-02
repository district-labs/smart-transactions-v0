import { erc20TransferIntentABI } from "@district-labs/intentify-core"
import { Erc20TransferIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateErc20Transfer } from "./validators"

const erc20TransferIntentEncodeABI = getAbiItem({
  abi: erc20TransferIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc20TransferIntentEncodeABI =
  typeof erc20TransferIntentEncodeABI

export const erc20Transfer = {
  name: "Erc20Transfer",
  deployed: Erc20TransferIntent,
  validate: validateErc20Transfer,
  abi: erc20TransferIntentEncodeABI,
} as const

export default erc20Transfer
