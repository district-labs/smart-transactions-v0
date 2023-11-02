import { uniswapV3TwapIntentABI } from "@district-labs/intentify-core"
import { UniswapV3TwapIntentIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

const uniswapv3TwapIntentEncodeABI = getAbiItem({
  abi: uniswapV3TwapIntentABI,
  name: "encodeIntent",
}).inputs

export type Uniswapv3TwapIntentEncodeABI = typeof uniswapv3TwapIntentEncodeABI

export const uniswapv3TwapIntent = {
  name: "UniswapV3Twap",
  deployed: UniswapV3TwapIntentIntent,
  abi: uniswapv3TwapIntentEncodeABI,
} as const

export default uniswapv3TwapIntent
