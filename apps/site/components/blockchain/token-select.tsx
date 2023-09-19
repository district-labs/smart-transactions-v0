'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { DialogProps } from '@radix-ui/react-alert-dialog'
import Image from 'next/image'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { LuCheck } from 'react-icons/lu'
import { useChainId } from 'wagmi'

import { defaultTokenList } from '@/components/blockchain/select-token-input/default-token-list'
import type { Token, TokenList } from '@/components/blockchain/select-token-input/types'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, trimAddress } from '@/lib/utils'

import { BlockExplorerLink } from './block-explorer-link'

interface SelectTokenProps extends DialogProps {
  disabled?: boolean
  selectedToken?: Token
  onSelectedTokenChange: (token: Token | undefined) => void
  tokenLists?: TokenList[]
  chainId?: number
}

export function SelectToken({
  tokenLists = defaultTokenList,
  chainId,
  selectedToken,
  onSelectedTokenChange,
  disabled = false,
  ...props
}: SelectTokenProps) {
  const [open, setOpen] = useState(false)
  const [tokenListIndex, setTokenListIndex] = useState(0)
  const [value, setValue] = useState('')

  const defaultChainId = useChainId()

  const selectedChainId = useMemo(() => chainId || defaultChainId, [chainId, defaultChainId])

  const tokenList = useMemo(() => (tokenLists.length === 1 ? tokenLists[0] : tokenLists[tokenListIndex]), [tokenLists, tokenListIndex])

  const filteredTokenList = useMemo(
    () =>
      tokenList?.tokens.filter((token) => {
        const tokenName = token.name.toLowerCase()
        const tokenSymbol = token.symbol.toLowerCase()
        const tokenAddress = token.address.toLowerCase()
        const isTokenMatch =
          tokenName.includes(value.toLowerCase()) || tokenSymbol.includes(value.toLowerCase()) || tokenAddress.includes(value.toLowerCase())
        const IsCorrectChain = token.chainId === selectedChainId

        return isTokenMatch && IsCorrectChain
      }),
    [tokenList, value, selectedChainId, tokenListIndex]
  )

  const handleSelect = useCallback((token: Token) => {
    onSelectedTokenChange(token)
    setOpen(false)
  }, [])

  useEffect(() => {
    onSelectedTokenChange(undefined)
  }, [selectedChainId])

  return (
    <>
      <button
        className="w-fit rounded-full border-2 border-stone-300 p-0.5"
        disabled={disabled}
        type="button"
        onClick={() => setOpen(true)}
        {...props}>
        {selectedToken ? (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Image
                priority
                alt={`${selectedToken.name} logo`}
                className="rounded-full"
                height={40}
                loader={({ src }) => `${src}?w=${40}&q=${100}`}
                quality={100}
                src={selectedToken.logoURI}
                width={40}
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-full rounded-xl border border-stone-300">
              <div className="flex items-center gap-x-8">
                <div className="text-left">
                  <h4>{selectedToken.symbol}</h4>
                  <h3 className="mt-1 text-lg font-bold">{selectedToken.name}</h3>
                </div>
                <div>
                  <h3>Token Address</h3>
                  <BlockExplorerLink address={selectedToken.address} chainId={selectedChainId}>
                    <h4 className="mt-1 w-4 max-w-full text-clip text-sm font-bold">{trimAddress(selectedToken.address)}</h4>
                  </BlockExplorerLink>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <AiOutlineQuestionCircle className="h-10 w-10 rounded-full border" />
        )}
      </button>
      <CommandDialog open={open} shouldFilter={false} onOpenChange={setOpen}>
        <h2 className="mb-3">Select Token</h2>
        <CommandInput placeholder="Type a command or search..." value={value} onValueChange={(value) => setValue(value)} />
        <CommandList className="mt-4 h-[400px]">
          <CommandEmpty className="flex h-[400px] items-center justify-center text-lg font-medium">No results found.</CommandEmpty>
          {filteredTokenList && filteredTokenList.length > 0 && (
            <CommandGroup heading="Tokens">
              {filteredTokenList.map((token) => (
                <CommandItem
                  key={token.address}
                  className="flex cursor-pointer items-center justify-between"
                  value={token.name}
                  onSelect={() => handleSelect(token)}>
                  <div>
                    <h4>{token.symbol}</h4>
                    <h3 className="mt-1 text-lg font-bold">{token.name}</h3>
                  </div>
                  <Image
                    priority
                    alt={`${token.name} logo`}
                    className="rounded-full"
                    height={40}
                    loader={({ src }) => `${src}?w=${40}&q=${100}`}
                    src={token.logoURI}
                    width={40}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        <div className="mt-8 flex items-center justify-between text-neutral-500">
          <span className="font-semibold">{tokenList?.name}</span>
          <Popover>
            <PopoverTrigger asChild>
              <button>Change Token List</button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-2">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Token Lists</h4>
                  {tokenLists.map(({ name }, index) => (
                    <button
                      key={name}
                      className={cn('flex items-center gap-x-2', index !== tokenListIndex && 'pl-6')}
                      onClick={() => setTokenListIndex(index)}>
                      {index === tokenListIndex && <LuCheck className="text-green-400" />}
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CommandDialog>
    </>
  )
}