import * as React from "react"
import { ButtonSiweSignIn } from "@/integrations/siwe/components/button-siwe-sign-in"
import { useIsSignedIn } from "@/integrations/siwe/hooks/use-is-signed-in"
import {
  IsSafeIntentModuleDisabled,
  useIsSafeIntentModuleEnabled
} from "@district-labs/intentify-core-react"
import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@district-labs/ui-react"
import { useAccount, useChainId } from "wagmi"

import { useUser } from "@/hooks/use-user"

import WalletConnectCustom from "../blockchain/wallet-connect-custom"
import { LinkComponent } from "../shared/link-component"
import { ViewCreateAndSetupSmartWallet } from "../view/view-create-and-setup-smart-wallet"
import { strategies } from "@/data/strategies"

type ButtonSetupSmartWalletBeforeSigningIntent =
  React.HTMLAttributes<HTMLElement> & {
    strategyId: string
  }

export const ButtonSetupSmartWalletBeforeSigningIntent = ({
  children,
  strategyId
}: ButtonSetupSmartWalletBeforeSigningIntent) => {
  const chainId = useChainId()
  const selectedStrategy = Object.values(strategies).find((strategy: any) => {
    return strategy.id === strategyId || strategy.alias === strategyId
  })
  const { address } = useAccount()
  const {
    data: userData,
    isSuccess: userIsSuccess,
  } = useUser()
  const isSmartWalletModuleEnabled = useIsSafeIntentModuleEnabled()
  const isSignedIn = useIsSignedIn()

  if (!address) {
    return (
      <WalletConnectCustom
        className="mx-auto inline-block w-full"
        classNameConnect={"w-full"}
      />
    )
  }

  if (!isSignedIn) {
    return <ButtonSiweSignIn label="Authenticate" className="w-full" />
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if(!selectedStrategy?.supportedChains?.includes(chainId)) {
    return (
        <Button variant="outline" className="w-full flex items-center gap-x-1">
          Support Coming Soon
        </Button>
    )
  }

  if (userIsSuccess && !userData?.isRegistered) {
    return (
      <LinkComponent href="/register" className="w-full">
        <Button variant="default" className="w-full">
          Register for Alpha
        </Button>
      </LinkComponent>
    )
  }

  if (isSmartWalletModuleEnabled) {
    return <>{children}</>
  }

  if (isSignedIn) {
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
          <ViewCreateAndSetupSmartWallet/>
        </SheetContent>
      </Sheet>
    )
  }

  return null
}
