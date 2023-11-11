"use client"

import { useCallback, useMemo, useState } from "react"
import type { Vault, VaultList } from "@district-labs/intentify-core"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@district-labs/ui-react"

import { cn } from "../../../utils"

interface VaultSelectorProps {
  disabled?: boolean
  selectedVault: Vault
  setSelectedVault: (token: Vault) => void
  className?: string
  vaultList: VaultList
}

export function VaultSelector({
  disabled,
  selectedVault,
  setSelectedVault,
  className,
  vaultList,
}: VaultSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const filteredVaultList = useMemo(() => {
    if (vaultList?.vaults && vaultList.vaults.length > 0) {
      return vaultList.vaults.filter((token: Vault) => {
        const tokenName = token.name.toLowerCase()
        const tokenSymbol = token.symbol.toLowerCase()
        const tokenAddress = token.address.toLowerCase()
        const isVaultMatch =
          tokenName.includes(searchValue.toLowerCase()) ||
          tokenSymbol.includes(searchValue.toLowerCase()) ||
          tokenAddress.includes(searchValue.toLowerCase())

        return isVaultMatch
      })
    } else {
      return [] as Vault[]
    }
  }, [vaultList?.vaults, searchValue])

  const handleSelect = useCallback(
    (token: Vault) => {
      setSelectedVault(token)
      setOpen(false)
      setSearchValue("")
    },
    [setSelectedVault]
  )

  return (
    <>
      <button
        className={(cn("w-fit rounded-full"), className)}
        onClick={() => (!disabled ? setOpen(true) : undefined)}
      >
        {selectedVault && (
          <img
            width="32"
            height="32"
            alt={`${selectedVault?.name} logo`}
            src={selectedVault?.logoURI}
          />
        )}
        {!selectedVault && (
          <span className="text-md font-medium">Select Vault</span>
        )}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <h2 className="ml-5 mt-4 text-sm font-bold">Select a Vault</h2>
        <CommandInput
          placeholder="Search name or paste address"
          value={searchValue}
          onValueChange={(value) => setSearchValue(value)}
        />
        <CommandList>
          <CommandEmpty>No vaults found.</CommandEmpty>
          {filteredVaultList &&
            filteredVaultList.length > 0 &&
            filteredVaultList.map((vault: Vault) => (
              <CommandItem
                key={vault.address}
                value={vault.name}
                className="flex gap-2"
                onSelect={() => handleSelect(vault)}
              >
                <img
                  width="32"
                  height="32"
                  alt={`${vault.name} logo`}
                  src={vault.logoURI}
                />
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">{vault.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {vault.symbol}
                  </p>
                </div>
              </CommandItem>
            ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
