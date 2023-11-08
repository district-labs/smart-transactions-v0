import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    DeploySafe,
    EnableSafeIntentModule,
    IsSafeCounterfactual,
    IsSafeIntentModuleDisabled,
    IsSafeIntentModuleEnabled,
    IsSafeMaterialized,
    useIsSafeIntentModuleEnabled
  } from "@district-labs/intentify-core-react"
import tokenList from "@/data/lists/token-list-testnet.json"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@district-labs/ui-react"
  
import { Erc20CardTokenOverview } from './erc20-card-token-overview';
import { useFindTokenFromList } from '@/integrations/erc20/hooks/use-find-token-from-list';
import { useChainId } from 'wagmi';
import { ResponsiveMobileAndDesktop } from '../shared/responsive-mobile-and-desktop';
import { ERC20BalanceSafe } from './erc20-balanceOf-safe';
import { ViewCreateAndSetupSmartWallet } from '../view/view-create-and-setup-smart-wallet';

type Erc20FavoriteTokensAndManagement = React.HTMLAttributes<HTMLElement>;

export const Erc20FavoriteTokensAndManagement = ({ className }: Erc20FavoriteTokensAndManagement) => { 
 const classes = cn('py-2 px-4 rounded-2xl bg-background shadow-sm border-2 border-neutral-100 dark:border-neutral-800 flex justify-between', className);

 return(
  <div className=''>
  <div className={classes}>
     <div className='flex items-center justify-between gap-x-4'>
        <ResponsiveMobileAndDesktop>
            <>  
            <Erc20Token symbol="WETH" />
            <Erc20Token symbol="USDC" />
            </>
            <>
            <Erc20Token symbol="WETH" />
            <Erc20Token symbol="USDC" />
            <Erc20Token symbol="DAI" />
            <Erc20Token symbol="DIS" />
            </>
        </ResponsiveMobileAndDesktop>
     </div>
     <Sheet >
      <SheetTrigger className='text-xs font-medium hover:opacity-80 cursor-pointer'>Manage Tokens</SheetTrigger>
      <SheetContent side="bottom" className='h-full w-full'>
        <IsSafeCounterfactual>
            <ViewCreateAndSetupSmartWallet />
        </IsSafeCounterfactual>
        <IsSafeMaterialized>

          <SheetHeader>
          <SheetTitle>Token Manage</SheetTitle>
          <SheetDescription>
              Manage your favorite tokens.
          </SheetDescription>
          </SheetHeader>
          <div className='grid gap-5 mt-10'>
              <Erc20CardTokenOverview symbol="WETH" />
              <Erc20CardTokenOverview symbol="USDC" />
              <Erc20CardTokenOverview symbol="DIS" />
              <Erc20CardTokenOverview symbol="RIZZ" />
              <Erc20CardTokenOverview symbol="DAI" />
          </div>
        </IsSafeMaterialized>
      </SheetContent>
      </Sheet>
    </div>
    <span className='text-2xs mt-1 text-light block mx-auto text-center w-full'>Favorite Tokens</span>
  </div>
)}

type Erc20Token = React.HTMLAttributes<HTMLElement> & {
    symbol: string;
};

export const Erc20Token = ({ className, symbol }: Erc20Token) => {
    const classes = cn(' flex items-center gap-x-2', className);
const chainId = useChainId();
 const token = useFindTokenFromList(tokenList, symbol, chainId)

 if(!token) return null;

 return(
  <div className={classes}>
   <img src={token.logoURI} className="w-6 h-6 rounded-full" alt={token.name} />
   <ERC20BalanceSafe address={token.address as `0x${string}`} chainId={token.chainId} />
   <span className='text-2xs font-medium'>{token.symbol}</span>
  </div>
)}
