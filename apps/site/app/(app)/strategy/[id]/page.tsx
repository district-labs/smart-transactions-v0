"use client"

import { strategies } from "@/data/strategies"
import { ButtonSiweSignIn } from "@/integrations/siwe/components/button-siwe-sign-in"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"
import { Card } from "@district-labs/ui-react"
import Balancer from "react-wrap-balancer"
import { useNetwork } from "wagmi"

import { siteConfig } from "@/config/site"
import { ChainIdToNetworkDetails } from "@/components/blockchain/chain-id-to-network-details"
import { NetworkConnectionManage } from "@/components/blockchain/network-connection-manage"
import WalletConnectCustom from "@/components/blockchain/wallet-connect-custom"
import { Erc20FavoriteTokensAndManagement } from "@/components/erc20/erc20-favorite-tokens-and-management"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { LinkComponent } from "@/components/shared/link-component"
import { SkeletonTable } from "@/components/skeleton/skeleton-table"
import { StrategyChainIdIsNotSupported } from "@/components/strategies/strategy-chain-id-is-not-supported"
import { StrategyChainIdIsSupported } from "@/components/strategies/strategy-chain-id-is-supported"

export default function Page({ params }: any) {
  const { chain: currentChain } = useNetwork()
  const selectedStrategy = Object.values(strategies).find((strategy: any) => {
    return strategy.id === params.id || strategy.alias === params.id
  })

  if (!selectedStrategy) {
    return <StrategyUnavailable />
  }

  const {
    name,
    description,
    IntentForm,
    IntentTable,
    id,
    tableColumns,
    transformData,
  } = selectedStrategy

  return (
    <>
      <StrategyChainIdIsNotSupported
        chainsSupported={selectedStrategy.chainsSupported}
      >
        <section className="relative mb-12">
          <div className="container mx-auto max-w-screen-md">
            <Erc20FavoriteTokensAndManagement />
          </div>
        </section>
      </StrategyChainIdIsNotSupported>
      <StrategyChainIdIsSupported
        chainsSupported={selectedStrategy.chainsSupported}
      >
        <section className="relative mb-12">
          <div className="container mx-auto max-w-screen-md">
            <Card className="flex items-center justify-between bg-red-100 p-3 dark:bg-red-800">
              <span className="font-semi-bold flex items-center gap-x-1 text-sm">
                <ChainIdToNetworkDetails chainId={currentChain?.id || 0} /> Not
                Supported
              </span>
              <NetworkConnectionManage
                chainsSupported={selectedStrategy.chainsSupported}
              />
            </Card>
          </div>
        </section>
      </StrategyChainIdIsSupported>
      <div className="overflow-hidden">
        <section className="relative mb-12">
          <div className="h-84 w-84 absolute inset-0 z-0 mx-auto rounded-full bg-gradient-radial from-neutral-200 via-white to-transparent dark:from-neutral-700 dark:via-transparent dark:to-transparent"></div>
          <div className="container relative z-10 max-w-2xl">
            <h3 className="text-4xl font-extrabold">{name}</h3>
            <p className="mt-2 text-sm">{description}</p>
            <div className="mt-4">
              <IntentForm
                strategyId={id}
                overrideValues={selectedStrategy?.overrideValues}
              />
            </div>
          </div>
        </section>

        <section className="bg-neutral-100 py-14 dark:bg-neutral-800">
          <div className="lg:max-w-screen-4xl container">
            <div className="mb-7 text-center">
              <h3 className="text-2xl font-extrabold">Overview</h3>
              <p className="mt-2 text-sm">
                <Balancer>
                  View all smart transactions you&apos;ve created for the{" "}
                  <span className="font-bold">{name}</span> strategy.
                </Balancer>
              </p>
            </div>
            <IsSignedOut>
              <div className="mb-8 text-center">
                <IsWalletConnected>
                  <ButtonSiweSignIn label="Authenticate" />
                </IsWalletConnected>
                <IsWalletDisconnected>
                  <WalletConnectCustom className="mx-auto inline-block w-full" />
                </IsWalletDisconnected>
              </div>
              <div className="rounded-xl bg-background p-4 shadow-md">
                <SkeletonTable />
              </div>
            </IsSignedOut>
            <IsSignedIn>
              <div className="rounded-xl bg-background p-4 shadow-md">
                <IntentTable
                  pageCount={10}
                  strategyId={id}
                  columns={tableColumns}
                  transformData={transformData}
                />
              </div>
            </IsSignedIn>
          </div>
        </section>
        <IsSignedIn>
          <section className="bg-background py-14 lg:py-32">
            <div className="lg:max-w-screen-4xl container">
              <div className="mb-7 text-center">
                <h3 className="text-2xl font-extrabold lg:text-5xl">
                  Become A Contributor
                </h3>
                <p className="mt-2 text-sm">
                  <Balancer>
                    Help us improve the{" "}
                    <span className="font-bold">{name}</span> strategy by
                    contributing to its development and data integrations.
                  </Balancer>
                </p>
                <p className="mt-4">
                  Join the{" "}
                  <LinkComponent
                    href={siteConfig.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-green-800 hover:opacity-80 dark:text-green-200"
                  >
                    District Labs Discord
                  </LinkComponent>{" "}
                  and start contributing today.
                </p>
              </div>
            </div>
          </section>
        </IsSignedIn>
      </div>
    </>
  )
}

const StrategyUnavailable = () => {
  return (
    <section className="p-1">
      <div className="container max-w-2xl text-center">
        <h3 className="text-4xl font-extrabold">Strategy Unavailable</h3>
        <p className="mt-4">
          The strategy you are looking for is not available at the moment.
        </p>
      </div>
    </section>
  )
}
