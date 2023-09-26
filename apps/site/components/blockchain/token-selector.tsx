"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import { type DefiLlamaToken } from "@/types"
import { useNetwork } from "wagmi"

import { cn } from "@/lib/utils"

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { defaultTokenList } from "./default-token-list"

interface TokenSelectorProps {
  selectedToken: DefiLlamaToken
  setSelectedToken: (token: DefiLlamaToken) => void
  className?: string
}

export default function TokenSelector({
  selectedToken,
  setSelectedToken,
  className,
}: TokenSelectorProps) {
  const { chain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [tokenListIndex, _setTokenListIndex] = useState(0)

  const tokenList = useMemo(
    () =>
      defaultTokenList.length === 1
        ? defaultTokenList[0]
        : defaultTokenList[tokenListIndex],
    [defaultTokenList, tokenListIndex]
  )

  const filteredTokenList = useMemo(
    () =>
      tokenList.tokens.filter((token) => {
        const tokenName = token.name.toLowerCase()
        const tokenSymbol = token.symbol.toLowerCase()
        const tokenAddress = token.address.toLowerCase()
        const isTokenMatch =
          tokenName.includes(searchValue.toLowerCase()) ||
          tokenSymbol.includes(searchValue.toLowerCase()) ||
          tokenAddress.includes(searchValue.toLowerCase())
        const IsCorrectChain = token.chainId === 1

        return isTokenMatch && IsCorrectChain
      }),
    [tokenList, searchValue, chain]
  )

  const handleSelect = useCallback(
    (token: DefiLlamaToken) => {
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
          <Image
            priority
            alt={`${selectedToken.name} logo`}
            className="rounded-full"
            height={40}
            loader={({ src }) => `${src}?w=${40}&q=${100}`}
            src={selectedToken.logoURI}
            width={40}
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
                <Image
                  priority
                  alt={`${token.name} logo`}
                  className="rounded-full"
                  height={40}
                  loader={({ src }) => `${src}?w=${40}&q=${100}`}
                  src={token.logoURI}
                  width={40}
                />
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">{token.name}</h3>
                  <p className="text-xs text-muted-foreground">
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
