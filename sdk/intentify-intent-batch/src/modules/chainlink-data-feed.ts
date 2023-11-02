import { chainlinkDataFeedIntentABI } from "@district-labs/intentify-core"
import { ChainlinkDataFeedIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateChainlinkDataFeed } from "./validators"

const chainlinkDataFeedIntentEncodeABI = getAbiItem({
  abi: chainlinkDataFeedIntentABI,
  name: "encodeIntent",
}).inputs

export type ChainlinkDataFeedIntentEncodeABI =
  typeof chainlinkDataFeedIntentEncodeABI

export const chainlinkDataFeed = {
  name: "ChainlinkDataFeed",
  deployed: ChainlinkDataFeedIntent,
  validate: validateChainlinkDataFeed,
  abi: chainlinkDataFeedIntentEncodeABI,
} as const

export default chainlinkDataFeed
