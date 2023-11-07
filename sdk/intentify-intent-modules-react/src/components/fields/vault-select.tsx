import { getValueFromPath, setValueFromPath } from "@/src/utils"
import { Label } from "@district-labs/ui-react"

import { VaultSelect as VaultSelectCore } from "./core/vault-select"

export type VaultSelectConfig = {
  className: string
  label: string
  classNameLabel?: string
  description?: string
  classNameDescription?: string
}

type VaultSelect = {
  path: string[]
  intentBatch: any
  setIntentBatch: any
  vaultList: any
  config: VaultSelectConfig
}

export const VaultSelect = ({
  path,
  vaultList,
  intentBatch,
  setIntentBatch,
  config,
}: VaultSelect) => {
  return (
    <div className={config?.className}>
      {config?.label && (
        <Label htmlFor={path.toString()} className={config?.classNameLabel}>
          {config?.label}
        </Label>
      )}
      <VaultSelectCore
        vaultList={vaultList}
        selectedVault={getValueFromPath(intentBatch, path)}
        setSelectedVault={(value) =>
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
