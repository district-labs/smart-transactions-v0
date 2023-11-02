import { erc20SwapSpotPriceExactTokenOutIntentABI } from "@district-labs/intentify-core"
import { Erc20SwapSpotPriceExactTokenOutIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateErc20SwapSpotPriceExactTokenOut } from "./validators"

const erc20SwapSpotPriceExactTokenOutIntentEncodeABI = getAbiItem({
  abi: erc20SwapSpotPriceExactTokenOutIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc20SwapSpotPriceExactTokenOutIntentEncodeABI =
  typeof erc20SwapSpotPriceExactTokenOutIntentEncodeABI

export const erc20SwapSpotPriceExactTokenOut = {
  name: "Erc20SwapSpotPriceExactTokenOut",
  deployed: Erc20SwapSpotPriceExactTokenOutIntent,
  validate: validateErc20SwapSpotPriceExactTokenOut,
  abi: erc20SwapSpotPriceExactTokenOutIntentEncodeABI,
} as const

export default erc20SwapSpotPriceExactTokenOut
