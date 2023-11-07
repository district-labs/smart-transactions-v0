import * as React from 'react';
import { cn } from '@/lib/utils';
import { Token, TokenList } from '@district-labs/intentify-core';
import { Address } from '../blockchain/address';
import Image from 'next/image';

type ERC20DetailsFromTokenList = React.HTMLAttributes<HTMLElement> & {
  tokenList: TokenList
  address: string
}

export const ERC20DetailsFromTokenList = ({ className, tokenList, address }: ERC20DetailsFromTokenList) => { 
 const classes = cn(className, 'flex gap-x-2 items-center');

 const [ selectedToken, setSelectedToken ] = React.useState<Token>()
 React.useEffect( () => { 
    setSelectedToken(tokenList.tokens.find(token => token.address === address))
 }, [tokenList, address])

 if(!selectedToken) return <span className='text-xs'>Token Info Unavailable</span>

 return(
  <div className={classes}>
    <Image alt={selectedToken.name} width={16} height={16} src={selectedToken?.logoURI} className="inline-block h-5 w-5 rounded-full" />
    <div className="flex flex-col gap-y-1">
      <div className='flex gap-x-1'>
        <span className="font-bold">{selectedToken?.symbol}</span>
        (<span className="text-2xs">{selectedToken?.name}</span>)
      </div>
      <Address
        isLink
        className="text-xs text-blue-500 hover:text-blue-600"
        truncate
        address={selectedToken.address as `0x${string}`}
      />
    </div>
  </div>
)}