import { Erc20SwapSpotPriceExactTokenInIntent } from "@district-labs/intentify-deployments"

export const erc20SwapSpotPriceExactTokenIn = {
  name: "Erc20SwapSpotPriceExactTokenIn",
  deployed: Erc20SwapSpotPriceExactTokenInIntent,
  abi: [
    {
      name: "tokenOut",
      type: "address",
    },
    {
      name: "tokenIn",
      type: "address",
    },
    {
      name: "tokenOutPriceFeed",
      type: "address",
    },
    {
      name: "tokenInPriceFeed",
      type: "address",
    },
    {
      name: "tokenInAmount",
      type: "uint256",
    },
    {
      name: "thresholdSeconds",
      type: "uint256",
    }
  ],
}

export default erc20SwapSpotPriceExactTokenIn
