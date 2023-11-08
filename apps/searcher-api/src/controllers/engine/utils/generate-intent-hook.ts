import {
  ADDRESS_ZERO,
  generateIntentId,
  type Hook,
} from "@district-labs/intentify-core"
import type { DbIntent } from "@district-labs/intentify-database"
import {
  aaveLeverageLong,
  blockNumberRange,
  chainlinkDataFeed,
  erc20LimitOrder,
  erc20Rebalance,
  erc20SwapSpotPriceExactTokenIn,
  erc20SwapSpotPriceExactTokenOut,
  erc20Transfer,
  ethTip,
  timestampRange,
  uniswapV3HistoricalTwapPercentageChangeIntent,
  uniswapv3TwapIntent,
} from "@district-labs/intentify-intent-batch"
import type { PublicClient } from "viem"

import {
  generateHookErc20LimitOrderIntent,
  generateHookErc20SwapSpotPriceExactTokenIn,
  generateHookErc20SwapSpotPriceExactTokenOut,
  generateHookEthTipIntent,
} from "./intent-hooks"

const EMPTY_HOOK: Hook = {
  target: ADDRESS_ZERO,
  data: "0x0",
  instructions: "0x0",
}

interface GenerateIntentHookParams {
  chainId: number
  intent: DbIntent
  publicClient: PublicClient
}

export async function generateIntentHook({
  chainId,
  intent,
  publicClient,
}: GenerateIntentHookParams): Promise<Hook> {
  switch (intent.intentId) {
    // TODO: Add hook for aaveLeverageLong
    case generateIntentId(aaveLeverageLong.name): {
      return EMPTY_HOOK
    }
    // The blockNumberRange intent doesn't require any hooks
    case generateIntentId(blockNumberRange.name): {
      return EMPTY_HOOK
    }
    // The chainlinkDataFeed intent doesn't require any hooks
    case generateIntentId(chainlinkDataFeed.name): {
      return EMPTY_HOOK
    }
    case generateIntentId(erc20LimitOrder.name): {
      return generateHookErc20LimitOrderIntent({
        chainId,
        intent,
        publicClient,
      })
    }
    // TODO: ADD FUNCTION
    case generateIntentId(erc20Rebalance.name): {
      // return ""
    }
    case generateIntentId(erc20SwapSpotPriceExactTokenIn.name): {
      return generateHookErc20SwapSpotPriceExactTokenIn({
        chainId,
        intent,
        publicClient,
      })
    }
    case generateIntentId(erc20SwapSpotPriceExactTokenOut.name): {
      return generateHookErc20SwapSpotPriceExactTokenOut({
        chainId,
        intent,
        publicClient,
      })
    }
    case generateIntentId(erc20Transfer.name): {
      return EMPTY_HOOK
    }
    case generateIntentId(ethTip.name): {
      return generateHookEthTipIntent({ chainId })
    }
    case generateIntentId(timestampRange.name): {
      return EMPTY_HOOK
    }
    // TODO: ADD FUNCTION
    case generateIntentId(uniswapV3HistoricalTwapPercentageChangeIntent.name): {
      // return ""
    }
    case generateIntentId(uniswapv3TwapIntent.name): {
      return EMPTY_HOOK
    }
    default:
      throw new Error(`Invalid intentId: ${intent.intentId}`)
  }
}
