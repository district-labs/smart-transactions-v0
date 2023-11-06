import { erc20SwapSpotPriceBalanceTokenOutIntentABI } from "@district-labs/intentify-core"
import { Erc20SwapSpotPriceBalanceTokenOutIntent } from "@district-labs/intentify-deployments"
import { getAbiItem } from "viem"

import { validateErc20SwapSpotPriceBalanceTokenOut } from "./validators"

const erc20SwapSpotPriceBalanceTokenOutIntentEncodeABI = getAbiItem({
  abi: erc20SwapSpotPriceBalanceTokenOutIntentABI,
  name: "encodeIntent",
}).inputs

export type Erc20SwapSpotPriceBalanceTokenOutIntentEncodeABI =
  typeof erc20SwapSpotPriceBalanceTokenOutIntentEncodeABI

export const erc20SwapSpotPriceBalanceTokenOut = {
  name: "Erc20SwapSpotPriceBalanceTokenOut",
  deployed: Erc20SwapSpotPriceBalanceTokenOutIntent,
  validate: validateErc20SwapSpotPriceBalanceTokenOut,
  abi: erc20SwapSpotPriceBalanceTokenOutIntentEncodeABI,
} as const

export default erc20SwapSpotPriceBalanceTokenOut
