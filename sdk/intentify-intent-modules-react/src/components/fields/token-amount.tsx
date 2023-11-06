import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Input as InputCore, Label } from "@district-labs/ui-react"
import { formatUnits, parseUnits } from "viem"

export type TokenAmountConfig = {
  className?: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

type TokenAmount = {
  path: string[]
  intentBatch: any
  setIntentBatch: any
  decimals: number
  config: TokenAmountConfig
}

export const TokenAmount = ({ path, intentBatch, setIntentBatch, decimals, config }: TokenAmount) => {
  return (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor="tokenAmount" className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <InputCore
        type="number"
        value={getValueFromPath(intentBatch, path)}
        onChange={(event: any) => {
          setIntentBatch((draft: any) => {
            setValueFromPath(draft, path, event.target.value)
          })
        }}
      />
      {config?.description && (
        <span className={config?.classNameDescription}>
          {config?.description}
        </span>
      )}
    </div>
  )
}
