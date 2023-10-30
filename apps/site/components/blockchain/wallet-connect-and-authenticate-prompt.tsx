import * as React from "react"
import { useIsSignedIn } from "@/integrations/siwe/hooks/use-is-signed-in"
import Balancer from "react-wrap-balancer"

import { ConnectWalletAndAuthenticate } from "./connect-wallet-and-authenticate"

export const WalletConnectAndAuthenticatePrompt = () => {
  const isSignedIn = useIsSignedIn()

  if (!isSignedIn)
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
        <div className="container mx-auto w-[420px] max-w-5xl rounded-xl bg-white p-3 text-center shadow-xl">
          <h3 className="text-3xl font-bold">Wallet Authentication</h3>
          <p className="mt-4 text-sm">
            <Balancer>
              To access your account, you must connect your wallet and
              authenticate.
            </Balancer>
          </p>
          <ConnectWalletAndAuthenticate className="mt-8" />
        </div>
      </div>
    )
  return null
}
