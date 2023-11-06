import type { Token, TokenList } from "@district-labs/intentify-core"

import { Input } from "./fields/input"
import { TokenSelect, TokenSelectConfig } from "./fields/token-select"
import {
  TokenSelectAndAmountConfig,
} from "./fields/token-select-and-amount"
import { TokenAmount } from "./fields/token-amount"
import { getValueFromPath } from "../utils"

export type IntentErc20SwapSpotPriceBalanceTokenOut = {
  erc20SwapSpotPriceBalanceTokenOut: {
    tokenOut: Token | undefined
    tokenIn: Token | undefined
    tokenOutPriceFeed: string | undefined
    tokenInPriceFeed: string | undefined
    thresholdSeconds: string | undefined
    minBalance: string | undefined
    balanceDelta: string | undefined
  }
}

export const intentErc20SwapSpotPriceBalanceTokenOut = {
  erc20SwapSpotPriceBalanceTokenOut: {
    tokenOut: undefined,
    tokenIn: undefined,
    tokenOutPriceFeed: undefined,
    tokenInPriceFeed: undefined,
    tokenOutAmount: undefined,
    thresholdSeconds: "3600",
    minBalance: undefined,
    balanceDelta: undefined,
  },
} as IntentErc20SwapSpotPriceBalanceTokenOut

export const intentErc20SwapSpotPriceBalanceTokenOutFields = {
  TokenOut: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: TokenList,
    config: TokenSelectAndAmountConfig
  ) => (
    <TokenSelect
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      path={["erc20SwapSpotPriceBalanceTokenOut", "tokenOut"]}
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
      path={["erc20SwapSpotPriceBalanceTokenOut", "tokenIn"]}
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
      path={["erc20SwapSpotPriceBalanceTokenOut", "tokenOutPriceFeed"]}
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
      path={["erc20SwapSpotPriceBalanceTokenOut", "tokenInPriceFeed"]}
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
      path={["erc20SwapSpotPriceBalanceTokenOut", "thresholdSeconds"]}
    />
  ),
  MinBalance: (
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
    <TokenAmount
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      decimals={getValueFromPath(intentBatch, ["erc20SwapSpotPriceBalanceTokenOut", "tokenOut", "decimals"])}
      path={["erc20SwapSpotPriceBalanceTokenOut", "minBalance"]}
    />
  ),
  BalanceDelta: (
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
    <TokenAmount
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      decimals={getValueFromPath(intentBatch, ["erc20SwapSpotPriceBalanceTokenOut", "tokenOut", "decimals"])}
      path={["erc20SwapSpotPriceBalanceTokenOut", "balanceDelta"]}
    />
  ),
}
