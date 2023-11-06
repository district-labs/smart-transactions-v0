"use client"

import { strategies } from "@/data/strategies"
import { ButtonSiweSignIn } from "@/integrations/siwe/components/button-siwe-sign-in"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"

import WalletConnectCustom from "@/components/blockchain/wallet-connect-custom"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { SkeletonTable } from "@/components/skeleton/skeleton-table"
import { StrategyTable } from "@/components/tables/strategy-table"
import { Erc20FavoriteTokensAndManagement } from "@/components/erc20/erc20-favorite-tokens-and-management"

export default function Page({ params }: any) {
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
        <section className="relative mb-12">
          <div className='container max-w-screen-md mx-auto'>
            <Erc20FavoriteTokensAndManagement />
          </div>
        </section>
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

        <section className="bg-neutral-100 p-14 dark:bg-neutral-800 ">
          <div className="max-w-screen-4xl container">
            <div className="mb-7 text-center">
              <h3 className="text-xl font-extrabold">
                Active Smart Transactions
              </h3>
              <p className="mt-2 text-sm">
                View all smart transactions you&apos;ve created for the{" "}
                <span className="font-bold">{name}</span> strategy.
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
