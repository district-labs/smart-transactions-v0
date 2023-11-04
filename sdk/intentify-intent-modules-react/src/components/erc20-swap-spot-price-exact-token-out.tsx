import type { Token, TokenList } from "@district-labs/intentify-core"

import { Input } from "./fields/input"
import { TokenSelect, TokenSelectConfig } from "./fields/token-select"
import {
  TokenSelectAndAmount,
  TokenSelectAndAmountConfig,
} from "./fields/token-select-and-amount"

export type IntentErc20SwapSpotPriceExactTokenOut = {
  ec20SwapSpotPriceExactTokenOut: {
    tokenOut: Token | undefined
    tokenIn: Token | undefined
    tokenOutPriceFeed: string | undefined
    tokenInPriceFeed: string | undefined
    tokenOutAmount: string | undefined
    thresholdSeconds: string | undefined
  }
}

export const intentErc20SwapSpotPriceExactTokenOut = {
  ec20SwapSpotPriceExactTokenOut: {
    tokenOut: undefined,
    tokenIn: undefined,
    tokenOutPriceFeed: undefined,
    tokenInPriceFeed: undefined,
    tokenOutAmount: undefined,
    thresholdSeconds: "3600",
  },
} as IntentErc20SwapSpotPriceExactTokenOut

export const intentErc20SwapSpotPriceExactTokenOutFields = {
  TokenOutAndAmount: (
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
      pathAmount={["ec20SwapSpotPriceExactTokenOut", "tokenOutAmount"]}
      pathToken={["ec20SwapSpotPriceExactTokenOut", "tokenOut"]}
    />
  ),
  TokenIn: (
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
      path={["ec20SwapSpotPriceExactTokenOut", "tokenIn"]}
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
      path={["ec20SwapSpotPriceExactTokenOut", "thresholdSeconds"]}
    />
  ),
}
