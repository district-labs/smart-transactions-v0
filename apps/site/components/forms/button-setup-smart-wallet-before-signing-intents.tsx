import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DeploySafe,
  EnableSafeIntentModule,
  IsSafeCounterfactual,
  IsSafeIntentModuleDisabled,
  IsSafeIntentModuleEnabled,
  IsSafeMaterialized,
  useIsSafeIntentModuleEnabled,
  useIsSafeMaterialized,
} from "@district-labs/intentify-core-react"

import {
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@district-labs/ui-react"

type ButtonSetupSmartWalletBeforeSigningIntent = React.HTMLAttributes<HTMLElement>;

export const ButtonSetupSmartWalletBeforeSigningIntent = ({ children, className }: ButtonSetupSmartWalletBeforeSigningIntent) => { 
  const classes = cn(className);
  const isSmartWalletDeployed = useIsSafeMaterialized()
  const isSmartWalletModuleEnabled = useIsSafeIntentModuleEnabled()

  if(isSmartWalletModuleEnabled) {
    return children
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="w-full">
          <IsSafeIntentModuleDisabled>
            <Button variant="default" className="w-full">
              Setup Smart Wallet
            </Button>
          </IsSafeIntentModuleDisabled>
        </div>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="h-full">
        <ScrollArea className="max-h-[100%] overflow-auto">
          <div className='container max-w-screen-md'>
            <SheetHeader>
              <SheetTitle className="text-4xl">
                Create Smart Wallet
              </SheetTitle>
              <SheetDescription className="text-lg">
                Setup a new smart wallet to manage your assets.
              </SheetDescription>
              </SheetHeader>
              <hr className="mb-10 mt-8" />
                <h3 className="text-xl font-bold">Step 1. Setup Safe Smart Wallet </h3>
                <p className="mt-3">
                  Safe is an open-source smart wallet that is
                  audited and battle-tested.
                </p>
                <IsSafeCounterfactual>
                  <DeploySafe className="my-4 block">
                    <Button size="lg" className='w-full'>Create Smart Wallet</Button>
                  </DeploySafe>
                </IsSafeCounterfactual>
                <IsSafeMaterialized>
                  <Button size="lg" className='w-full my-4'>Smart Wallet Created</Button>
                </IsSafeMaterialized>
      
                  <h3 className="text-xl font-bold mt-8">Step 2. Sign Permission and Enable District Finance Module</h3>
                  <p className="mt-3">
                    Enable the District Finance module to create smart transactions. 
                  </p>
                <IsSafeCounterfactual>
                  <Button size="lg" disabled={true} variant="outline" className='mt-4 w-full'>Enable Module</Button>
                </IsSafeCounterfactual>
                <IsSafeMaterialized>
                  <EnableSafeIntentModule
                    className="my-4 block w-full"
                    signMessageComponent={<Button className='w-full'>Sign Permission</Button>}
                    signTransactionComponent={<Button className='w-full'>Enable Module</Button>}
                  />
                </IsSafeMaterialized>
                  <h3 className="text-xl font-bold mt-8">Step 3. Sign Smart Transaction</h3>
                  <p className="mt-3">
                    Start using District Finance to create smart transactions.
                  </p>
                <IsSafeIntentModuleEnabled>
                  <h3 className="text-4xl font-normal">Congratulations!</h3>
                  <p className="text-lg">Your smart wallet is ready to use.</p>
                </IsSafeIntentModuleEnabled>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
)}