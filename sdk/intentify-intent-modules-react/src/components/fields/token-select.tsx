import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Label } from "@district-labs/ui-react"

import { TokenSelect as TokenSelectCore } from "./core/token-select"

export type TokenSelectConfig = {
  className: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

type TokenSelect = {
  path: string[]
  intentBatch: any
  setIntentBatch: any
  tokenList: any
  config: TokenSelectConfig
}

export const TokenSelect = ({
  path,
  tokenList,
  intentBatch,
  setIntentBatch,
  config,
}: TokenSelect) => {
  return (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor={path.toString()} className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <TokenSelectCore
        tokenList={tokenList}
        selectedToken={getValueFromPath(intentBatch, path)}
        setSelectedToken={(value) =>
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, path, value)
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
