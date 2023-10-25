"use client"

import { CardContent, CardFooter } from "@district-labs/ui-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountPage() {
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"

  return (
    <>
      <Tabs className="w-full" defaultValue="smart-transactions">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <h1 className="text-4xl font-bold">Account</h1>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger className={classesTabTrigger} value="Overview">
                Overview
              </TabsTrigger>
              <TabsTrigger
                className={classesTabTrigger}
                value="smart-transactions"
              >
                Smart Transactions
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="wallet">
                Smart Wallet
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="feedback">
                Feedback
              </TabsTrigger>
            </TabsList>
          </div>
        </section>
        <section className="section py-10">
          <div className="container max-w-6xl">
            <TabsContent value="overview">
              <div className="">
                <h2 className="mb-4 text-lg font-semibold">Overview</h2>
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
                <h2 className="mb-4 text-lg font-semibold">Feedback Content</h2>
                <p className="text-gray-500">
                  This is the content for the Feedback tab.
                </p>
              </div>
            </TabsContent>
          </div>
        </section>
      </Tabs>
    </>
  )
}
