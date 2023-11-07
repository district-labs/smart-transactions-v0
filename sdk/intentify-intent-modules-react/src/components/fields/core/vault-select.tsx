import type { Vault, VaultList } from "@district-labs/intentify-core"

import { VaultSelector } from "./vault-selector"

interface VaultSelect {
  selectedVault: Vault
  setSelectedVault: (token: Vault) => void
  vaultList: VaultList
}

export function VaultSelect({
  selectedVault,
  setSelectedVault,
  vaultList,
}: VaultSelect) {
  return (
    <div className="group relative flex items-center gap-2 rounded-md border p-2">
      <VaultSelector
        vaultList={vaultList}
        selectedVault={selectedVault}
        setSelectedVault={setSelectedVault}
        className=""
      />
      {selectedVault && (
        <span className="text-sm font-medium">
          {selectedVault.name} ({selectedVault.symbol})
        </span>
      )}
    </div>
  )
}
