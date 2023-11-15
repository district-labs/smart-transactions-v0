"use client"

import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"
import { ADDRESS_ZERO } from "@district-labs/intentify-core"
import {
  useGetSafeAddress,
  useIsSafeIntentModuleEnabled,
  useIsSafeMaterialized,
} from "@district-labs/intentify-core-react"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@district-labs/ui-react"

import { Address } from "@/components/blockchain/address"
import { BlockieSmartWallet } from "@/components/blockchain/blockie-smart-wallet"
import { WalletConnectAndAuthenticatePrompt } from "@/components/blockchain/wallet-connect-and-authenticate-prompt"
import { Erc20CardTokenOverview } from "@/components/erc20/erc20-card-token-overview"
import { LinkComponent } from "@/components/shared/link-component"
import { SkeletonCardStrategyActive } from "@/components/skeleton/skeleton-card-strategy-active"
import { CardStrategyActive } from "@/components/strategies/card-strategy-active"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserActiveStrategies } from "@/hooks/strategy/user/use-strategy-user-active-find"

export default function SmartWalletPage() {
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"
  const address = useGetSafeAddress()
  return (
    <>
      <WalletConnectAndAuthenticatePrompt />
      <Tabs className="w-full" defaultValue="active-strategies">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <div className="grid gap-x-6 lg:grid-cols-2">
              <div className="">
                <h1 className="text-4xl font-bold">Smart Wallet</h1>
                <p>Manage your smart wallet and transactions.</p>
              </div>
              <div className="mt-3 flex lg:items-center lg:justify-end">
                <div className="order-2 ml-2 lg:order-1 lg:mr-2 lg:text-right">
                  <Address address={address || ADDRESS_ZERO} />
                  <p className="text-xs text-foreground">
                    Smart Wallet Address (Safe)
                  </p>
                </div>
                <BlockieSmartWallet className="order-1 h-12 w-12 rounded-full border-2 border-white shadow-md lg:order-2" />
              </div>
            </div>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger
                className={classesTabTrigger}
                value="active-strategies"
              >
                Active Strategies
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="token-balances">
                Token Balances
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="overview">
                Overview
              </TabsTrigger>
            </TabsList>
          </div>
        </section>
        <section className="section py-10">
          <IsSignedOut>
            <div className="container max-w-6xl">
              <SkeletonCardStrategyActive />
            </div>
          </IsSignedOut>
          <IsSignedIn>
            <div className="container max-w-6xl">
              <TabsContent value="active-strategies" className="">
                <StrategiesActive />
              </TabsContent>
              <TabsContent value="overview">
                <SmartWalletInformation />
                <SmartWalletDeployStatus />
                <SmartWalletModuleStatus />
              </TabsContent>
              <TabsContent value="token-balances" className=" grid gap-y-6">
                <Erc20CardTokenOverview symbol="WETH" mintAmount={1} />
                <Erc20CardTokenOverview symbol="USDC" mintAmount={1000} />
                <Erc20CardTokenOverview symbol="DIS" mintAmount={10} />
                <Erc20CardTokenOverview symbol="RIZZ" mintAmount={5} />
              </TabsContent>
            </div>
          </IsSignedIn>
        </section>
      </Tabs>
    </>
  )
}

const StrategiesActive = () => {
  const safeAddress = useGetSafeAddress()
  const { data } = useUserActiveStrategies({
    filters: {
      intentBatchRoot: safeAddress as `0x${string}`,
    },
  })

  if (!data?.length || !Array.isArray(data))
    return <div className="">No active strategies</div>

  return (
    <div className="grid gap-y-10">
      {data.map((strategy: any, idx: number) => (
        <CardStrategyActive key={idx} {...strategy} />
      ))}
    </div>
  )
}

const SmartWalletInformation = () => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-bold">How It Works</h3>
        <p className="text-sm">
          A Smart Wallet is required to interact with the District Finance
          application.
        </p>
      </CardHeader>
      <CardContent className="content">
        <p className="">
          District Finance uses a{" "}
          <LinkComponent href="https://safe.global/">
            Safe Smart Wallet
          </LinkComponent>{" "}
          to manage your funds and transactions. You always remain in{" "}
          <span className="font-bold">control of your funds</span>.
        </p>
        <p className="mt-4">
          You&apos;re Smart Wallet can be used to interact with any application
          that supports the Safe protocol.
        </p>
      </CardContent>
      <CardFooter className="bg-card-footer py-4">
        <LinkComponent href="https://safe.global/">
          <Button variant="default" className="btn">
            Learn More
          </Button>
        </LinkComponent>
      </CardFooter>
    </Card>
  )
}

const SmartWalletDeployStatus = () => {
  const isSmartWalletDeployed = useIsSafeMaterialized()
  const address = useGetSafeAddress()
  return (
    <Card className="mt-10">
      <CardHeader>
        <h3 className="text-2xl font-bold">Deployment Status</h3>
        <p className="text-sm">
          Before you can use District Finance, you must deploy your Safe Smart.
        </p>
      </CardHeader>
      <CardContent className="content">
        <p className="">
          The Safe Smart Wallet address is deterministically generated.{" "}
          <span className="italic">
            You can send funds to your Smart Wallet even before it&apos;s
            deployed.
          </span>
        </p>
        <p className="mt-4">
          Smart Wallet Address:{" "}
          <Address address={address || ADDRESS_ZERO} className="font-medium" />
        </p>
      </CardContent>
      <CardFooter className="bg-card-footer py-4">
        {isSmartWalletDeployed && (
          <Button className="btn">Wallet Deployed</Button>
        )}
        {!isSmartWalletDeployed && (
          <Button className="btn">Deploy Wallet</Button>
        )}
      </CardFooter>
    </Card>
  )
}

const SmartWalletModuleStatus = () => {
  const isSmartWalletModuleEnabled = useIsSafeIntentModuleEnabled()
  return (
    <Card className="mt-10">
      <CardHeader>
        <h3 className="text-2xl font-bold">Module Status</h3>
        <p className="text-sm">
          The Safe Smart Wallet requires the District Finance module to be
          enabled.
        </p>
      </CardHeader>
      <CardFooter className="bg-card-footer py-4">
        {isSmartWalletModuleEnabled && (
          <Button className="btn">Module Enabled</Button>
        )}
        {!isSmartWalletModuleEnabled && (
          <Button className="btn">Enable Module</Button>
        )}
      </CardFooter>
    </Card>
  )
}
