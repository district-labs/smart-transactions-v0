import type { Token, TokenList } from "@district-labs/intentify-core"

import { Input } from "./fields/input"
import { TokenSelect, TokenSelectConfig } from "./fields/token-select"
import {
  TokenSelectAndAmount,
  TokenSelectAndAmountConfig,
} from "./fields/token-select-and-amount"

export type IntentErc20SwapSpotPriceExactTokenIn = {
  ec20SwapSpotPriceExactTokenIn: {
    tokenOut: Token | undefined
    tokenIn: Token | undefined
    tokenOutPriceFeed: string | undefined
    tokenInPriceFeed: string | undefined
    tokenInAmount: string | undefined
    thresholdSeconds: string | undefined
  }
}

export const intentErc20SwapSpotPriceExactTokenIn = {
  ec20SwapSpotPriceExactTokenIn: {
    tokenOut: undefined,
    tokenIn: undefined,
    tokenOutPriceFeed: undefined,
    tokenInPriceFeed: undefined,
    tokenInAmount: undefined,
    thresholdSeconds: "3600",
  },
} as IntentErc20SwapSpotPriceExactTokenIn

export const intentErc20SwapSpotPriceExactTokenInFields = {
  TokenInAndAmount: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: TokenList,
    config: TokenSelectAndAmountConfig
  ) => (
    <TokenSelectAndAmount
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      pathAmount={["ec20SwapSpotPriceExactTokenIn", "tokenInAmount"]}
      pathToken={["ec20SwapSpotPriceExactTokenIn", "tokenIn"]}
    />
  ),
  TokenOut: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: TokenList,
    config: TokenSelectConfig
  ) => (
    <TokenSelect
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      path={["ec20SwapSpotPriceExactTokenIn", "tokenOut"]}
    />
  ),
  TokenOutPriceFeed: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <Input
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      path={["ec20SwapSpotPriceExactTokenIn", "tokenOutPriceFeed"]}
    />
  ),
  TokenInPriceFeed: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <Input
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      path={["ec20SwapSpotPriceExactTokenIn", "tokenInPriceFeed"]}
    />
  ),
  ThresholdSeconds: (
    intentBatch: any,
    setIntentBatch: any,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <Input
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      path={["ec20SwapSpotPriceExactTokenIn", "thresholdSeconds"]}
    />
  ),
}
