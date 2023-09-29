import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import * as React from 'react';
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { DeploySafe, EnableSafeIntentModule, IsSafeCounterfactual, IsSafeIntentModuleDisabled, IsSafeIntentModuleEnabled, IsSafeMaterialized } from "@district-labs/intentify-react";

// type SheetSafeSetup = {}

export const SheetSafeSetup = ({}) => {
 return(
<Sheet>
    <SheetTrigger asChild>
        <div className=''>
            <IsSafeIntentModuleDisabled>
                <Button size="lg" className="text-xl py-7 px-12">Get Started</Button>
            </IsSafeIntentModuleDisabled>
        </div>
    </SheetTrigger>
    <SheetContent className="sm:max-w-1/2 sm:w-[720px] max-h-screen">
      <ScrollArea className="max-h-[100%] overflow-auto">
        <SheetHeader>
          <SheetTitle className="text-4xl">Create a New Smart Wallet</SheetTitle>
          <SheetDescription className="text-lg">
            Create a smart wallet to manage your funds and assets.
          </SheetDescription>
          <hr className="mt-8 mb-10" />
          <IsSafeCounterfactual>
            <h3 className='font-bold text-xl'>Step 1. Sign </h3>
            <p className='mt-3'>
                Safe is an open-source, non-custodial smart wallet that is audited and battle-tested. Responsible for <span className='font-bold'>holding over $45B in assets.</span> Yes... <span className='font-bold italic'>billion</span>. That&apos;s a whooole lot of zeros.
            </p>
            <DeploySafe displaySafeAddress className="my-4 block">
                <Button size="lg">Create Smart Wallet</Button>
            </DeploySafe>
            <p className='mt-3 text-sm'>
                p.s. we&apos;ll cover the gas fees for you 🤗
            </p>
            </IsSafeCounterfactual>
            <IsSafeMaterialized>
            <IsSafeIntentModuleDisabled>
                <h3 className='font-bold text-xl'>Step 2. Enable Intents</h3>
                <p className='mt-3'>
                    <span className='font-bold'>Congratulations!</span> Your smart wallet is ready to use.
                </p>
                <p className='mt-3'>
                    Let&apos;s enable intents so you can sign smart transactions.
                </p>

                <EnableSafeIntentModule
                className="my-4 block"
                signMessageComponent={
                    <Button>Grant Permission</Button>
                }
                signTransactionComponent={
                    <Button>Execute</Button>
                }
                />
            </IsSafeIntentModuleDisabled>
            <IsSafeIntentModuleEnabled>
                <h3 className='font-normal text-4xl'>Congratulations!</h3>
                <p className='text-lg'>Your smart wallet is ready to use.</p>
            </IsSafeIntentModuleEnabled>
            </IsSafeMaterialized>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  </Sheet>
)}

