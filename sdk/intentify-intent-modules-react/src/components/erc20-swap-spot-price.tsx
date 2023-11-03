import type { Token, TokenList } from "@district-labs/intentify-core"

import { Select, SelectConfig } from "./fields/select"
import { TokenSelect, TokenSelectConfig } from "./fields/token-select"
import {
  TokenSelectAndAmount,
  TokenSelectAndAmountConfig,
} from "./fields/token-select-and-amount"

export type IntentErc20SwapSpotPrice = {
  erc20SwapSpotPrice: {
    tokenOut: Token | undefined
    tokenIn: Token | undefined
    tokenOutPriceFeed: string
    tokenInPriceFeed: string
    tokenAmountExpected: string
    thresholdSeconds: string
    isBuy: string
  }
}

export const intentErc20SwapSpotPrice = {
  erc20SwapSpotPrice: {
    tokenOut: undefined,
    tokenIn: undefined,
    tokenOutPriceFeed: "0x",
    tokenInPriceFeed: "0x",
    tokenAmountExpected: "0",
    thresholdSeconds: "0",
    isBuy: "buy",
  },
} as IntentErc20SwapSpotPrice

export const intentErc20SwapSpotPriceFields = {
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
      pathAmount={["erc20SwapSpotPrice", "tokenAmountExpected"]}
      pathToken={["erc20SwapSpotPrice", "tokenOut"]}
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
      path={["erc20SwapSpotPrice", "tokenIn"]}
    />
  ),
  IsBuy: (intentBatch: any, setIntentBatch: any, config: SelectConfig) => (
    <Select
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      path={["erc20SwapSpotPrice", "isBuy"]}
      options={[
        {
          value: "buy",
          label: "Buy",
        },
        {
          value: "sell",
          label: "Sell",
        },
      ]}
    />
  ),
}
