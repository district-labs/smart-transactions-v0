import {
  aaveLeverageLong,
  blockNumberRange,
  erc20LimitOrder,
  erc20SwapSpotPrice,
  ethTip,
  timestampRange,
  uniswapv3HistoricalTwapIntent,
  uniswapv3TwapIntent,
} from "./modules"

export const intentModulesDefault = [
  aaveLeverageLong,
  blockNumberRange,
  ethTip,
  erc20LimitOrder,
  erc20SwapSpotPrice,
  timestampRange,
  uniswapv3HistoricalTwapIntent,
  uniswapv3TwapIntent,
]
