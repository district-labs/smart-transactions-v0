import { type Dispatch, type SetStateAction } from "react"
import type { Vault, VaultList } from "@district-labs/intentify-core"

import { VaultSelector } from "./vault-selector"

interface VaultSelectAndAmount {
  disabled?: boolean
  amount: number | undefined
  setAmount: Dispatch<SetStateAction<number | undefined>>
  selectedVault: Vault
  setSelectedVault: (token: Vault) => void
  vaultList: VaultList
}

export function VaultSelectAndAmount({
  disabled,
  amount,
  setAmount,
  selectedVault,
  setSelectedVault,
  vaultList,
}: VaultSelectAndAmount) {
  return (
    <div className="group relative flex items-center justify-between gap-2 rounded-md border p-2">
      <div className="flex items-center gap-x-2">
        <VaultSelector
          disabled={disabled}
          vaultList={vaultList}
          selectedVault={selectedVault}
          setSelectedVault={setSelectedVault}
        />
        {selectedVault?.symbol && (
          <span className="text-sm font-medium">
            {selectedVault.name} ({selectedVault.symbol})
          </span>
        )}
      </div>
      <input
        disabled={disabled}
        id="amount"
        type="number"
        className="placeholder:text-muted-foreground block w-full flex-1 bg-transparent px-3 py-1 text-right text-sm text-xl font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
    </div>
  )
}
