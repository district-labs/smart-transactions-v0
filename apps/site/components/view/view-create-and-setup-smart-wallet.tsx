import * as React from "react"
import {
  DeploySafe,
  EnableSafeIntentModule,
  IsSafeCounterfactual,
  IsSafeMaterialized,
} from "@district-labs/intentify-core-react"
import {
  Button,
  ScrollArea,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@district-labs/ui-react"

type ViewCreateAndSetupSmartWallet = React.HTMLAttributes<HTMLElement>

export const ViewCreateAndSetupSmartWallet =
  ({}: ViewCreateAndSetupSmartWallet) => {
    return (
      <ScrollArea className="max-h-[100%] overflow-auto">
        <div className="container max-w-screen-md">
          <SheetHeader>
            <SheetTitle className="text-4xl">Create Smart Wallet</SheetTitle>
            <SheetDescription className="text-lg">
              Setup a new smart wallet to manage your assets.
            </SheetDescription>
          </SheetHeader>
          <hr className="mb-10 mt-8" />
          <h3 className="text-xl font-bold">
            Step 1. Setup Safe Smart Wallet{" "}
          </h3>
          <p className="mt-3">
            Safe is an open-source smart wallet that is audited and
            battle-tested.
          </p>
          <IsSafeCounterfactual>
            <DeploySafe className="my-4 block w-full">
              <span>
                Create Smart Wallet
              </span>
            </DeploySafe>
          </IsSafeCounterfactual>
          <IsSafeMaterialized>
            <Button size="lg" className="my-4 w-full">
              Smart Wallet Created
            </Button>
          </IsSafeMaterialized>

          <h3 className="mt-8 text-xl font-bold">
            Step 2. Sign Permission and Enable District Finance Module
          </h3>
          <p className="mt-3">
            Enable the District Finance module to create smart transactions.
          </p>
          <IsSafeCounterfactual>
            <Button
              size="lg"
              disabled={true}
              variant="outline"
              className="mt-4 w-full"
            >
              Enable Module
            </Button>
          </IsSafeCounterfactual>
          <IsSafeMaterialized>
            <EnableSafeIntentModule
              className="my-4 block w-full"
              signMessageComponent={
                  <Button className="w-full">Sign Permission</Button>
              }
              signTransactionComponent={
                <Button className="w-full">Enable Module</Button>
              }
            />
          </IsSafeMaterialized>
        </div>
      </ScrollArea>
    )
  }
