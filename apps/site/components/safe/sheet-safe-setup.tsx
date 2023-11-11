import * as React from "react"
import {
  DeploySafe,
  EnableSafeIntentModule,
  IsSafeCounterfactual,
  IsSafeIntentModuleDisabled,
  IsSafeIntentModuleEnabled,
  IsSafeMaterialized,
} from "@district-labs/intentify-core-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

// type SheetSafeSetup = {}

export const SheetSafeSetup = ({ children }: any) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="">
          <IsSafeIntentModuleDisabled>{children}</IsSafeIntentModuleDisabled>
        </div>
      </SheetTrigger>
      <SheetContent className="sm:max-w-1/2 max-h-screen sm:w-[720px]">
        <ScrollArea className="max-h-[100%] overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-4xl">
              Create a New Smart Wallet
            </SheetTitle>
            <SheetDescription className="text-lg">
              Create a smart wallet to manage your funds and assets.
            </SheetDescription>
            <hr className="mb-10 mt-8" />
            <IsSafeCounterfactual>
              <h3 className="text-xl font-bold">Step 1. Sign </h3>
              <p className="mt-3">
                Safe is an open-source, non-custodial smart wallet that is
                audited and battle-tested. Responsible for{" "}
                <span className="font-bold">holding over $45B in assets.</span>{" "}
                Yes... <span className="font-bold italic">billion</span>.
                That&apos;s a whooole lot of zeros.
              </p>
              <DeploySafe className="my-4 block">
                <Button size="lg">Create Smart Wallet</Button>
              </DeploySafe>
              <p className="mt-3 text-sm">
                p.s. we&apos;ll cover the gas fees for you 🤗
              </p>
            </IsSafeCounterfactual>
            <IsSafeMaterialized>
              <IsSafeIntentModuleDisabled>
                <h3 className="text-xl font-bold">Step 2. Enable Intents</h3>
                <p className="mt-3">
                  <span className="font-bold">Congratulations!</span> Your smart
                  wallet is ready to use.
                </p>
                <p className="mt-3">
                  Let&apos;s enable intents so you can sign smart transactions.
                </p>

                <EnableSafeIntentModule
                  className="my-4 block"
                  signMessageComponent={<Button>Grant Permission</Button>}
                  signTransactionComponent={<Button>Execute</Button>}
                />
              </IsSafeIntentModuleDisabled>
              <IsSafeIntentModuleEnabled>
                <h3 className="text-4xl font-normal">Congratulations!</h3>
                <p className="text-lg">Your smart wallet is ready to use.</p>
              </IsSafeIntentModuleEnabled>
            </IsSafeMaterialized>
          </SheetHeader>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
