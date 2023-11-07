import type { Vault, VaultList } from "@district-labs/intentify-core"
import { VaultSelect } from "./fields/vault-select"
import { TokenAmount } from "./fields/token-amount"
import { getValueFromPath } from "../utils"

type ERC4626DepositBalanceContinual = {
  erc4626DepositBalanceContinual: {
    tokenOut: Vault | undefined
    minBalance: string | undefined
    balanceDelta: string | undefined
  }
}

export const intentERC4626DepositBalanceContinual = {
  erc4626DepositBalanceContinual: {
    tokenOut: undefined,
    minBalance: undefined,
    balanceDelta: undefined,
  },
} as ERC4626DepositBalanceContinual

export const intentERC4626DepositBalanceContinualFields = {
    TokenOut: (
        intentBatch: any,
        setIntentBatch: any,
        vaultList: VaultList,
        config: {
          className: string
          label: string
          classNameLabel?: string
          description?: string
          classNameDescription?: string
        }
      ) => (
        <VaultSelect
          intentBatch={intentBatch}
          config={config}
          setIntentBatch={setIntentBatch}
          vaultList={vaultList}
          path={["erc4626DepositBalanceContinual", "tokenOut"]}
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
          decimals={getValueFromPath(intentBatch, ["erc4626DepositBalanceContinual", "tokenOut", "decimals"])}
          path={["erc4626DepositBalanceContinual", "minBalance"]}
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
          decimals={getValueFromPath(intentBatch, ["erc4626DepositBalanceContinual", "tokenOut", "decimals"])}
          path={["erc4626DepositBalanceContinual", "balanceDelta"]}
        />
      ),
}
