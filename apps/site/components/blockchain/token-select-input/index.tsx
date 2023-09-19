'use client'

import { type InputHTMLAttributes, forwardRef, useMemo, useState } from 'react'

import Image from 'next/image'
import { LuCheck } from 'react-icons/lu'
import { PiMoney } from 'react-icons/pi'
import { useChainId } from 'wagmi'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { defaultTokenList } from './default-token-list'
import type { TokenList } from './types'

export interface SelectTokenInputProps extends InputHTMLAttributes<HTMLInputElement> {
  tokenLists?: TokenList[]
}

const SelectTokenInput = forwardRef<HTMLInputElement, SelectTokenInputProps>(
  ({ className, placeholder = 'Token search...', tokenLists = defaultTokenList, ...props }, ref) => {
    const [tokenListIndex, setTokenListIndex] = useState(0)
    const [value, setValue] = useState('')
    const chainId = useChainId()

    const tokenList = useMemo(() => (tokenLists.length === 1 ? tokenLists[0] : tokenLists[tokenListIndex]), [tokenLists, tokenListIndex])

    const filteredTokenList = useMemo(
      () =>
        tokenList?.tokens.filter((token) => {
          const tokenName = token.name.toLowerCase()
          const tokenSymbol = token.symbol.toLowerCase()
          const tokenAddress = token.address.toLowerCase()
          const isTokenMatch =
            tokenName.includes(value.toLowerCase()) || tokenSymbol.includes(value.toLowerCase()) || tokenAddress.includes(value.toLowerCase())
          const IsCorrectChain = token.chainId === chainId

          return isTokenMatch && IsCorrectChain
        }),
      [tokenList, value, chainId]
    )
    const selectedToken = useMemo(() => (filteredTokenList?.length === 1 ? filteredTokenList[0] : undefined), [tokenList, value, chainId])

    return (
      <div className="relative">
        <input
          ref={ref}
          placeholder={placeholder}
          value={value}
          className={cn(
            'flex h-14 w-full items-center text-xl font-bold text-neutral-600 rounded-full border border-stone-300 bg-transparent py-2 pl-8 pr-20 placeholder:font-light placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
            className
          )}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
        <Popover>
          <PopoverTrigger asChild>
            <button className="absolute top-1/2 -translate-y-1/2 text-xs font-bold right-16 text-neutral-400">{tokenList.name}</button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border rounded-xl border-stone-300">
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
        {!tokenList && <div className="">Select Token List</div>}
        {selectedToken ? (
          <Image
            alt={`${selectedToken.name} logo`}
            className="absolute top-1/2 -translate-y-1/2 right-2"
            height={44}
            loader={({ src }) => `${src}?w=${44}&q=${75}`}
            src={selectedToken.logoURI}
            width={44}
          />
        ) : (
          <PiMoney className="absolute top-1/2 -translate-y-1/2 right-6 text-2xl text-neutral-400" />
        )}
      </div>
    )
  }
)
SelectTokenInput.displayName = 'SelectTokenInput'

export { SelectTokenInput }