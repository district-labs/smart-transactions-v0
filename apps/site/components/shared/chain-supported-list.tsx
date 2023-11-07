import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChainIdToNetworkDetails } from '../blockchain/chain-id-to-network-details';

type Props = React.HTMLAttributes<HTMLElement> & {
    supportedChains: number[];
}

export const ChainsSupportedList = ({ className, supportedChains }: Props) => { 
 const classes = cn(className);
    if(supportedChains?.length < 1) {
        return <span className='text-xs'>Coming Soon</span>;
    }
 return(
  <div className={classes}>
    {
        supportedChains.map((chainId) => <ChainIdToNetworkDetails key={chainId} chainId={chainId} /> )
    }
  </div>
)}