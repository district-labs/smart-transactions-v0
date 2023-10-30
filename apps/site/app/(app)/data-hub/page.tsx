"use client"

import { dataHubHistorical } from "@/data/data-hub-historical"
import { FileText } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardDataHubHistoricalQuery } from "@/components/data-hub/card-data-hub-historical-query"

export default function DataHubPage() {
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"

  return (
    <>
      <Tabs className="w-full" defaultValue="future">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <div className="flex items-center gap-x-2">
              <FileText size={32} />
              <h1 className="text-4xl font-bold">Zero-Knowledge Data Hub</h1>
            </div>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger className={classesTabTrigger} value="future">
                Historical
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="upcoming">
                Upcoming
              </TabsTrigger>
            </TabsList>
          </div>
        </section>
        <section className="section py-10">
          <div className="container max-w-6xl">
            <TabsContent value="future" className="grid grid-cols-3 gap-x-12">
              {dataHubHistorical.map((dataHubHistorical) => (
                <CardDataHubHistoricalQuery
                  key={String(dataHubHistorical.id)}
                  {...dataHubHistorical}
                />
              ))}
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
            <TabsContent value="upcoming">
              <div className="">
                <h2 className="mb-4 text-lg font-semibold">Upcoming blocks</h2>
              </div>
            </TabsContent>
          </div>
        </section>
      </Tabs>
    </>
  )
}
