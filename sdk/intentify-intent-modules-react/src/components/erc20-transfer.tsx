import type { Token, TokenList } from "@district-labs/intentify-core"

import { Input } from "./fields/input"
import { TokenSelectAndAmount } from "./fields/token-select-and-amount"

export type IntentErc20Transfer = {
  erc20Transfer: {
    tokenOut: Token | undefined
    amountOut: string
    to: string
  }
}

export const intentErc20Transfer = {
  erc20Transfer: {
    tokenOut: undefined,
    amountOut: "0",
    to: "0",
  },
} as IntentErc20Transfer

export const intentErc20TransferFields = {
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
      pathAmount={["erc20Transfer", "amountOut"]}
      pathToken={["erc20Transfer", "tokenOut"]}
    />
  ),
  to: (
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
      path={["erc20Transfer", "to"]}
    />
  ),
}
