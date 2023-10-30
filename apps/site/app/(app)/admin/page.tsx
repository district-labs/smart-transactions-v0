"use client"

import { useIntentBatchAdminGetAll } from "@/hooks/intent-batch/admin/use-intent-batch-admin-get-all"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IntentBatchTable } from "@/components/admin/intent-batch-table"
import { WalletConnectAndAuthenticatePrompt } from "@/components/blockchain/wallet-connect-and-authenticate-prompt"
import { FormAdminGenerateStrategyId } from "@/components/forms/form-admin-generate-strategy-id"

export default function AdminPage() {
  const intentBatch = useIntentBatchAdminGetAll()
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"

  return (
    <>
      <WalletConnectAndAuthenticatePrompt />
      <Tabs className="w-full" defaultValue="overview">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <h1 className="text-4xl font-bold">Admin</h1>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger className={classesTabTrigger} value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="utilities">
                Utilities
              </TabsTrigger>
            </TabsList>
          </div>
        </section>
        <section className="section py-10">
          <div className="container max-w-6xl">
            <TabsContent value="overview">
              <IntentBatchTable data={intentBatch.data} />
            </TabsContent>
            <TabsContent value="utilities">
              <FormAdminGenerateStrategyId />
            </TabsContent>
          </div>
        </section>
      </Tabs>
    </>
  )
}
