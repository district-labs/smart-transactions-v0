import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Vault, VaultList } from '@district-labs/intentify-core';
import { Address } from '../blockchain/address';
import Image from 'next/image';

type ERC20DetailsFromVaultList = React.HTMLAttributes<HTMLElement> & {
  vaultList: VaultList
  address: string
}

export const ERC20DetailsFromVaultList = ({ className, vaultList, address }: ERC20DetailsFromVaultList) => { 
 const classes = cn(className, 'flex gap-x-2 items-center');

 const [ selectedToken, setSelectedToken ] = React.useState<Vault>()
 React.useEffect( () => { 
    setSelectedToken(vaultList.vaults.find((token: Vault) => token.address === address))
 }, [vaultList, address])

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