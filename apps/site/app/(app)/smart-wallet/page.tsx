"use client"

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Address } from "@/components/blockchain/address"
import { BlockieSmartWallet } from "@/components/blockchain/blockie-smart-wallet"
import { LinkComponent } from "@/components/shared/link-component"

export default function SmartWalletPage() {
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"
  const address = useGetSafeAddress()
  return (
    <>
      <Tabs className="w-full" defaultValue="overview">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <div className="grid gap-x-6 lg:grid-cols-2">
              <div className="">
                <h1 className="text-4xl font-bold">Smart Wallet</h1>
                <p className="text-gray-500">
                  Manage your smart wallet and transactions.
                </p>
              </div>
              <div className="mt-3 flex lg:items-center lg:justify-end">
                <div className="order-2 ml-2 lg:order-1 lg:mr-2 lg:text-right">
                  <Address
                    address={address || ADDRESS_ZERO}
                    className="text-gray-500"
                  />
                  <p className="text-xs text-foreground">
                    Smart Wallet Address (Safe)
                  </p>
                </div>
                <BlockieSmartWallet className="order-1 h-12 w-12 rounded-full border-2 border-white shadow-md lg:order-2" />
              </div>
            </div>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger className={classesTabTrigger} value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="wallet">
                Token Balances
              </TabsTrigger>
            </TabsList>
          </div>
        </section>
        <section className="section py-10">
          <div className="container max-w-6xl">
            <TabsContent value="overview">
              <SmartWalletInformation />
              <SmartWalletDeployStatus />
              <SmartWalletModuleStatus />
            </TabsContent>
            <TabsContent value="wallet" className=" grid grid-cols-5">
              <div className="col-span-3">
                <h2 className="mb-4 text-lg font-semibold">Status</h2>
                <p className="text-gray-500">
                  This is the content for the Wallet tab.
                </p>
              </div>
              <div className="col-span-2 rounded-md bg-neutral-50 shadow-sm">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Smart Wallet</h2>
                  <p className="text-gray-500">
                    Type: <span className="font-semibold">Safe</span>
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </section>
      </Tabs>
    </>
  )
}

const SmartWalletInformation = () => {
  const isSmartWalletDeployed = useIsSafeMaterialized()
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
          You're Smart Wallet can be used to interact with any application
          that supports the Safe protocol.
        </p>
      </CardContent>
      <CardFooter className="bg-neutral-50 py-4">
        <LinkComponent href="https://safe.global/">
          <Button variant="default" className="btn">Learn More</Button>
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
        <p className=''>
          The Safe Smart Wallet address is deterministically generated. <span className='italic'>You can send funds to your Smart Wallet even before it's deployed.</span>
        </p>
        <p className='mt-4'>
          Smart Wallet Address: <Address address={address || ADDRESS_ZERO} className="font-medium" />
        </p>
      </CardContent>
      <CardFooter className="bg-neutral-50 py-4">
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
          The Safe Smart Wallet requires the District Finance module to be enabled.
        </p>
      </CardHeader>
      <CardFooter className="bg-neutral-50 py-4">
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
