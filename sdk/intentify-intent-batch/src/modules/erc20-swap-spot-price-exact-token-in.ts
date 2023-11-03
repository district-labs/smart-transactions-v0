import { erc20SwapSpotPriceExactTokenInIntentABI } from "@district-labs/intentify-core"
import { Erc20SwapSpotPriceExactTokenInIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

const erc20SwapSpotPriceExactTokenInIntentEncodeABI = getAbiItem({
  abi: erc20SwapSpotPriceExactTokenInIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc20SwapSpotPriceExactTokenInIntentEncodeABI =
  typeof erc20SwapSpotPriceExactTokenInIntentEncodeABI

export const erc20SwapSpotPriceExactTokenIn = {
  name: "Erc20SwapSpotPriceExactTokenIn",
  deployed: Erc20SwapSpotPriceExactTokenInIntent,
  abi: erc20SwapSpotPriceExactTokenInIntentEncodeABI,
} as const

export default erc20SwapSpotPriceExactTokenIn
