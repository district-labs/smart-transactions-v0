"use client"

import { useCallback, useMemo, useState } from "react"
import type { Token, TokenList } from "@district-labs/intentify-core"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@district-labs/ui-react"

import { cn } from "../../utils"

interface TokenSelectorProps {
  selectedToken: Token
  setSelectedToken: (token: Token) => void
  className?: string
  tokenList: TokenList
}

export function TokenSelector({
  selectedToken,
  setSelectedToken,
  className,
  tokenList,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const filteredTokenList = useMemo(() => {
    if (tokenList?.tokens && tokenList.tokens.length > 0) {
      return tokenList.tokens.filter((token) => {
        const tokenName = token.name.toLowerCase()
        const tokenSymbol = token.symbol.toLowerCase()
        const tokenAddress = token.address.toLowerCase()
        const isTokenMatch =
          tokenName.includes(searchValue.toLowerCase()) ||
          tokenSymbol.includes(searchValue.toLowerCase()) ||
          tokenAddress.includes(searchValue.toLowerCase())

        return isTokenMatch
      })
    } else {
      return [] as Token[]
    }
  }, [tokenList?.tokens, searchValue])

  const handleSelect = useCallback(
    (token: Token) => {
      setSelectedToken(token)
      setOpen(false)
      setSearchValue("")
    },
    [setSelectedToken]
  )

  return (
    <>
      <button
        className={(cn("w-fit rounded-full"), className)}
        onClick={() => setOpen(true)}
      >
        {selectedToken && (
          <img
            width="32"
            height="32"
            alt={`${selectedToken.name} logo`}
            className="rounded-full"
            src={selectedToken.logoURI}
          />
        )}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <h2 className="ml-4 mt-4 text-sm font-bold">Select a token</h2>
        <CommandInput
          placeholder="Search name or paste address"
          value={searchValue}
          onValueChange={(value) => setSearchValue(value)}
        />
        <CommandList>
          <CommandEmpty>No tokens found.</CommandEmpty>
          {filteredTokenList &&
            filteredTokenList.length > 0 &&
            filteredTokenList.map((token) => (
              <CommandItem
                key={token.address}
                value={token.name}
                className="flex gap-2"
                onSelect={() => handleSelect(token)}
              >
                <img
                  width="32"
                  height="32"
                  alt={`${token.name} logo`}
                  className="rounded-full"
                  src={token.logoURI}
                />
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">{token.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {token.symbol}
                  </p>
                </div>
              </CommandItem>
            ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
