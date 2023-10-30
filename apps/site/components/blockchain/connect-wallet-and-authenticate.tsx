import * as React from "react"
import { ButtonSiweSignIn } from "@/integrations/siwe/components/button-siwe-sign-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"

import { cn } from "@/lib/utils"

import { IsWalletConnected } from "../shared/is-wallet-connected"
import { IsWalletDisconnected } from "../shared/is-wallet-disconnected"
import { WalletConnectCustom } from "./wallet-connect-custom"

type ConnectWalletAndAuthenticate = React.HTMLAttributes<HTMLElement>

export const ConnectWalletAndAuthenticate = ({
  className,
}: ConnectWalletAndAuthenticate) => {
  const classes = cn(className)

  return (
    <div className={classes}>
      <IsSignedOut>
        <div className="mb-8 text-center">
          <IsWalletConnected>
            <ButtonSiweSignIn label="Authenticate" />
          </IsWalletConnected>
          <IsWalletDisconnected>
            <WalletConnectCustom className="mx-auto inline-block w-full" />
          </IsWalletDisconnected>
        </div>
      </IsSignedOut>
    </div>
  )
}
