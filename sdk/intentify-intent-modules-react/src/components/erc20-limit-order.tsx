import type { Token, TokenList } from "@district-labs/intentify-core"

import { TokenSelectAndAmount } from "./fields/token-select-and-amount"

export type IntentErc20LimitOrder = {
  erc20LimitOrder: {
    tokenOut: Token | undefined
    tokenIn: Token | undefined
    amountOut: string
    amountIn: string
  }
}

export const intentErc20LimitOrder = {
  erc20LimitOrder: {
    tokenOut: undefined,
    tokenIn: undefined,
    amountOut: "0",
    amountIn: "0",
  },
} as IntentErc20LimitOrder

export const intentErc20LimitOrderFields = {
  tokenOutAndAmount: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: TokenList,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <TokenSelectAndAmount
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      pathAmount={["erc20LimitOrder", "amountOut"]}
      pathToken={["erc20LimitOrder", "tokenOut"]}
    />
  ),
  tokenInAndAmount: (
    intentBatch: any,
    setIntentBatch: any,
    tokenList: TokenList,
    config: {
      className: string
      label: string
      classNameLabel?: string
      description?: string
      classNameDescription?: string
    }
  ) => (
    <TokenSelectAndAmount
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      pathAmount={["erc20LimitOrder", "amountIn"]}
      pathToken={["erc20LimitOrder", "tokenIn"]}
    />
  ),
}
