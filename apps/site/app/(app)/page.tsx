"use client"

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
import { StrategyPreview } from "@/components/strategies/strategy-preview"
import { ViewAaveLeverageLongIntent } from "@/components/views/view-aave-leverage-long-intent"
import { ViewIntentLimitOrder } from "@/components/views/view-intent-limit-order"

export default function Home() {
  return (
    <div className="space-y-4 overflow-hidden">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 bg-background px-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:px-8 lg:py-20"
      >
        <h1 className="text-3xl font-bold leading-tight tracking-normal md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Web3 Simplified
        </h1>
        <Balancer className="my-2 max-w-3xl text-lg text-muted-foreground sm:text-xl">
          Interact with blockchains without the hassle.{" "}
          <span className="font-bold">
            Smart transactions for smart contracts.
          </span>
        </Balancer>
      </section>
      <IsSafeIntentModuleDisabled>
        <section className="h-full text-center">
          <div className="mx-auto max-w-screen-lg text-center">
            <div className=" mt-4">
              <IsWalletConnected>
                <SheetSafeSetup />
                <p className="mt-4">
                  Setup a best in class in Smart Wallet -{" "}
                  <LinkComponent className="link" href="https://safe.global/">
                    Safe
                  </LinkComponent>
                </p>
              </IsWalletConnected>
              <IsWalletDisconnected>
                <WalletConnectCustom />
              </IsWalletDisconnected>
            </div>
          </div>
        </section>
      </IsSafeIntentModuleDisabled>
      <IsSafeIntentModuleEnabled>
        <section className="h-full px-10 lg:px-20">
          <div className="mb-10 text-center">
            <IsSignedOut>
              <ButtonSIWELogin
                className="mx-auto mt-4 block"
                label="Authenticate Wallet"
              />
              <p className="mt-4 text-sm">
                Sign in with your Ethereum wallet to get started
              </p>
            </IsSignedOut>
          </div>
          <IsSignedIn>
            <div className="max-w-screen-3xl mx-auto grid gap-10 text-left lg:grid-cols-3">
              <StrategyPreview
                name="Limit Order"
                description="Swap tokens at a specific price and time"
                image="/images/story/limit-order.png"
                nonceType="QueueNonce"
                modules={["TimestampBefore", "TokenRelease", "TokenSwap"]}
                intentView={<ViewIntentLimitOrder />}
              />

              <StrategyPreview
                name="Aave Leverage Long"
                description="Leverage long on Aave"
                image="/images/story/rebalance.png"
                nonceType="TimeNonce"
                modules={["TokenRelease", "TokenSwap"]}
                intentView={<ViewAaveLeverageLongIntent />}
              />

              <StrategyPreview
                name="Weekly Savings Deposit"
                description="Deposit into PoolTogether Savings protocol weekly"
                image="/images/story/saving.png"
                nonceType="TimeNonce"
                modules={["AveragePrizeZK"]}
              />
            </div>
          </IsSignedIn>
        </section>
      </IsSafeIntentModuleEnabled>
    </div>
  )
}
