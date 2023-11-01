import { Erc20SwapSpotPriceExactTokenOutIntent } from "@district-labs/intentify-deployments"

export const erc20SwapSpotPriceExactTokenOut = {
  name: "Erc20SwapSpotPriceExactTokenOut",
  deployed: Erc20SwapSpotPriceExactTokenOutIntent,
  args: [
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
      name: "tokenOutAmount",
      type: "uint256",
    },
    {
      name: "thresholdSeconds",
      type: "uint256",
    }
  ],
}

export default erc20SwapSpotPriceExactTokenOut
