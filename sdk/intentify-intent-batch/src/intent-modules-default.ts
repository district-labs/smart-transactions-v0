import {
  aaveLeverageLong,
  blockNumberRange,
  chainlinkDataFeed,
  erc20LimitOrder,
  erc20Transfer,
  erc20SwapSpotPriceExactTokenIn,
  erc20SwapSpotPriceExactTokenOut,
  ethTip,
  timestampRange,
  uniswapV3HistoricalTwapPercentageChangeIntent,
  uniswapv3TwapIntent,
} from "./modules"

export const intentModulesDefault = [
  aaveLeverageLong,
  blockNumberRange,
  chainlinkDataFeed,
  ethTip,
  erc20Transfer,
  erc20LimitOrder,
  erc20SwapSpotPriceExactTokenIn,
  erc20SwapSpotPriceExactTokenOut,
  timestampRange,
  uniswapV3HistoricalTwapPercentageChangeIntent,
  uniswapv3TwapIntent,
]
