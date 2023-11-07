import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Label } from "@district-labs/ui-react"
import type { Vault } from "@district-labs/intentify-core"
import { VaultSelectAndAmount as VaultSelectAndAmountCore } from "./core/vault-select-and-amount"

export type VaultSelectAndAmountConfig = {
  className: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

export type VaultSelectAndAmount = {
  disabled?: boolean
  pathAmount: string[]
  pathToken: string[]
  intentBatch: any
  setIntentBatch: any
  tokenList: any
  config: VaultSelectAndAmountConfig
}

export const VaultSelectAndAmount = ({
  disabled,
  pathAmount,
  pathToken,
  tokenList,
  intentBatch,
  setIntentBatch,
  config,
}: VaultSelectAndAmount) => {
  return (
    <div className={config?.className}>
      {config?.label && (
        <Label
          htmlFor={pathToken.toString()}
          className={config?.classNameLabel}
        >
          {config?.label}
        </Label>
      )}
      <VaultSelectAndAmountCore
        disabled={disabled}
        tokenList={tokenList}
        amount={getValueFromPath(intentBatch, pathAmount)}
        setAmount={(value: number) =>
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, pathAmount, value)
          })
        }
        selectedToken={getValueFromPath(intentBatch, pathToken)}
        setSelectedToken={(value: Vault) =>
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, pathToken, value)
          })
        }
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  )
}
