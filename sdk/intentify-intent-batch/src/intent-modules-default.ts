import {
  aaveLeverageLong,
  blockNumberRange,
  erc20LimitOrder,
  erc20SwapSpotPriceExactTokenIn,
  erc20SwapSpotPriceExactTokenOut,
  erc20SwapSpotPrice,
  ethTip,
  timestampRange,
  uniswapV3HistoricalTwapPercentageChangeIntent,
  uniswapv3TwapIntent,
} from "./modules"

export const intentModulesDefault = [
  aaveLeverageLong,
  blockNumberRange,
  ethTip,
  erc20LimitOrder,
  erc20SwapSpotPriceExactTokenIn,
  erc20SwapSpotPriceExactTokenOut,
  erc20SwapSpotPrice,
  timestampRange,
  uniswapV3HistoricalTwapPercentageChangeIntent,
  uniswapv3TwapIntent,
]
