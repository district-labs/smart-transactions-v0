"use client"

import { strategies } from "@/data/strategies"
import { ButtonSIWELogin } from "@/integrations/siwe/components/button-siwe-login"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"
import {
  IsSafeIntentModuleDisabled,
  IsSafeIntentModuleEnabled,
} from "@district-labs/intentify-core-react"
import Balancer from "react-wrap-balancer"

import WalletConnectCustom from "@/components/blockchain/wallet-connect-custom"
import { SheetSafeSetup } from "@/components/safe/sheet-safe-setup"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { LinkComponent } from "@/components/shared/link-component"
import { CardStrategyPreview } from "@/components/strategies/card-strategy-preview"

export default function Home() {
  return (
    <div className="relative space-y-4 overflow-hidden">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 px-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:px-8 lg:py-20"
      >
        <h1 className="text-3xl font-bold leading-tight tracking-normal md:text-5xl lg:text-6xl lg:leading-[1.1]">
          District Finance
        </h1>
        <Balancer className="my-2 max-w-3xl text-lg text-muted-foreground sm:text-xl">
          Interact with blockchains without the hassle.{" "}
          <span className="font-bold">
            Smart transactions that work for you.
          </span>
        </Balancer>
      </section>
        <section className="h-full px-10 lg:px-20">
        <div className="max-w-screen-3xl mx-auto grid gap-10 text-left lg:grid-cols-3">
              {Object.values(strategies).map((strategy) => {
                const { name, description, image, id, alias, createdBy } =
                  strategy
                return (
                  <CardStrategyPreview
                    key={id}
                    id={id}
                    alias={alias}
                    name={name}
                    description={description}
                    createdBy={createdBy}
                  />
                )
              })}
            </div>
        </section>
    </div>
  )
}
