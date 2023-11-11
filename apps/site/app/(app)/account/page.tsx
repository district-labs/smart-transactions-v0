"use client"

import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnectAndAuthenticatePrompt } from "@/components/blockchain/wallet-connect-and-authenticate-prompt"
import { FormUserEmailPreferences } from "@/components/forms/form-user-email-preferences"
import { FormUserProfile } from "@/components/forms/form-user-profile"
import { SkeletonCardBasic } from "@/components/skeleton/skeleton-card-basic"
import { SkeletonCardForm } from "@/components/skeleton/skeleton-card-form"
import { CardUserProfile } from "@/components/user/card-user-profile"

export default function AccountPage() {
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"

  return (
    <>
      <WalletConnectAndAuthenticatePrompt />
      <Tabs className="w-full" defaultValue="profile">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <h1 className="text-4xl font-bold">Account</h1>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger className={classesTabTrigger} value="profile">
                Profile
              </TabsTrigger>
              {/* <TabsTrigger className={classesTabTrigger} value="feedback">
                Feedback
              </TabsTrigger> */}
            </TabsList>
          </div>
        </section>
        <section className="section py-10">
          <IsSignedOut>
            <div className="container max-w-6xl">
              <div className="grid grid-cols-6 gap-x-12">
                <div className="col-span-4">
                  <SkeletonCardForm />
                </div>
                <div className="col-span-2">
                  <SkeletonCardBasic />
                </div>
              </div>
            </div>
          </IsSignedOut>
          <IsSignedIn>
            <div className="container max-w-6xl">
              <TabsContent
                value="profile"
                className="grid gap-12 lg:grid-cols-6"
              >
                <div className="order-2 grid gap-y-10 lg:order-1 lg:col-span-4">
                  <FormUserProfile />
                  <FormUserEmailPreferences />
                </div>
                <div className="order-1 lg:order-2 lg:col-span-2">
                  <CardUserProfile />
                </div>
              </TabsContent>
              <TabsContent value="smart-transactions">
                <div className="">
                  <h2 className="mb-4 text-lg font-semibold">
                    Smart Transactions
                  </h2>
                </div>
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
              <TabsContent value="feedback">
                <div className="">
                  <h2 className="mb-4 text-lg font-semibold">
                    Feedback Content
                  </h2>
                  <p className="text-gray-500">
                    This is the content for the Feedback tab.
                  </p>
                </div>
              </TabsContent>
            </div>
          </IsSignedIn>
        </section>
      </Tabs>
    </>
  )
}
