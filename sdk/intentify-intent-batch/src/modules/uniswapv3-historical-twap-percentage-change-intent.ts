import { uniswapV3HistoricalTwapPercentageChangeIntentABI } from "@district-labs/intentify-core"
import { UniswapV3HistoricalTwapPercentageChangeIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

const uniswapV3HistoricalTwapPercentageChangeIntentEncodeABI = getAbiItem({
  abi: uniswapV3HistoricalTwapPercentageChangeIntentABI,
  name: "encodeIntent",
}).inputs
export type UniswapV3HistoricalTwapPercentageChangeIntentEncodeABI =
  typeof uniswapV3HistoricalTwapPercentageChangeIntentEncodeABI

export const uniswapV3HistoricalTwapPercentageChangeIntent = {
  name: "UniswapHistoricalV3TwapPercentageChange",
  deployed: UniswapV3HistoricalTwapPercentageChangeIntent,
  abi: uniswapV3HistoricalTwapPercentageChangeIntentEncodeABI,
} as const

export default uniswapV3HistoricalTwapPercentageChangeIntent
