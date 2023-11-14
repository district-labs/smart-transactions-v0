import type { Token, TokenList } from "@district-labs/intentify-core"

import { getValueFromPath } from "../utils"
import { TokenAmount } from "./fields/token-amount"
import { TokenSelect } from "./fields/token-select"

export type IntentAaveV3SupplyBalanceContinual = {
  aaveV3SupplyBalanceContinual: {
    tokenOut: Token | undefined
    minBalance: string | undefined
    balanceDelta: string | undefined
  }
}

export const intentAaveV3SupplyBalanceContinual = {
  aaveV3SupplyBalanceContinual: {
    tokenOut: undefined,
    minBalance: undefined,
    balanceDelta: undefined,
  },
} as IntentAaveV3SupplyBalanceContinual

export const intentAaveV3SupplyBalanceContinualFields = {
  TokenOut: (
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
    <TokenSelect
      intentBatch={intentBatch}
      config={config}
      setIntentBatch={setIntentBatch}
      tokenList={tokenList}
      path={["aaveV3SupplyBalanceContinual", "tokenOut"]}
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
      decimals={getValueFromPath(intentBatch, [
        "aaveV3SupplyBalanceContinual",
        "tokenOut",
        "decimals",
      ])}
      path={["aaveV3SupplyBalanceContinual", "minBalance"]}
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
      decimals={getValueFromPath(intentBatch, [
        "aaveV3SupplyBalanceContinual",
        "tokenOut",
        "decimals",
      ])}
      path={["aaveV3SupplyBalanceContinual", "balanceDelta"]}
    />
  ),
}
