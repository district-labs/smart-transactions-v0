import { UniswapV3TwapIntentIntent } from "@district-labs/intentify-deployments"

export const uniswapv3TwapIntent = {
  name: "UniswapV3Twap",
  deployed: UniswapV3TwapIntentIntent,
  abi: [
    {
      name: "uniswapV3Pool",
      type: "address",
    },
    {
      name: "twapIntervalSeconds",
      type: "uint32",
    },
    {
      name: "minPriceX96",
      type: "uint256",
    },
    {
      name: "maxPriceX96",
      type: "uint256",
    },
  ],
}

export default uniswapv3TwapIntent
