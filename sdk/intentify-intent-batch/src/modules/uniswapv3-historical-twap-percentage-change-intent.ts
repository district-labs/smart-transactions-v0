import { UniswapV3HistoricalTwapPercentageChangeIntent } from "@district-labs/intentify-deployments"

export const uniswapV3HistoricalTwapPercentageChangeIntent = {
  name: "UniswapHistoricalV3TwapPercentageChange",
  deployed: UniswapV3HistoricalTwapPercentageChangeIntent,
  args: [
    {
      name: "uniswapV3Pool",
      type: "address",
    },
    {
      name: "numeratorReferenceBlockOffset",
      type: "uint256",
    },
    {
      name: "numeratorBlockWindow",
      type: "uint256",
    },
    {
      name: "numeratorBlockWindowTolerance",
      type: "uint256",
    },
    {
      name: "denominatorReferenceBlockOffset",
      type: "uint256",
    },
    {
      name: "denominatorBlockWindow",
      type: "uint256",
    },
    {
      name: "denominatorBlockWindowTolerance",
      type: "uint256",
    },
    {
      name: "minPercentageDifference",
      type: "uint256",
    },
    {
      name: "maxPercentageDifference",
      type: "uint256",
    },
  ],
}

export default uniswapV3HistoricalTwapPercentageChangeIntent
