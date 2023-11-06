import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Label } from "@district-labs/ui-react"

import { TokenSelectAndAmount as TokenSelectAndAmountCore } from "./core/token-select-and-amount"

export type TokenSelectAndAmountConfig = {
  className: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

export type TokenSelectAndAmount = {
  disabled?: boolean
  pathAmount: string[]
  pathToken: string[]
  intentBatch: any
  setIntentBatch: any
  tokenList: any
  config: TokenSelectAndAmountConfig
}

export const TokenSelectAndAmount = ({
  disabled,
  pathAmount,
  pathToken,
  tokenList,
  intentBatch,
  setIntentBatch,
  config,
}: TokenSelectAndAmount) => {
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
      <TokenSelectAndAmountCore
        disabled={disabled}
        tokenList={tokenList}
        amount={getValueFromPath(intentBatch, pathAmount)}
        setAmount={(value) =>
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, pathAmount, value)
          })
        }
        selectedToken={getValueFromPath(intentBatch, pathToken)}
        setSelectedToken={(value) =>
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
