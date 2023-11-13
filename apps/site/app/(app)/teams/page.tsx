"use client"

import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnectAndAuthenticatePrompt } from "@/components/blockchain/wallet-connect-and-authenticate-prompt"
import { SkeletonCardBasic } from "@/components/skeleton/skeleton-card-basic"
import { SkeletonCardForm } from "@/components/skeleton/skeleton-card-form"
import { TeamCard } from "@/components/team/team-card"
import { TeamCreateDialog } from "@/components/team/team-create-dialog"
import { TeamsList } from "@/components/team/teams-list"

export default function TeamPage() {
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"

  return (
    <>
      <WalletConnectAndAuthenticatePrompt />
      <Tabs className="w-full" defaultValue="teams">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-2">
              <h1 className="text-4xl font-bold">Team</h1>
              <div className="flex justify-end">
                <TeamCreateDialog />
              </div>
            </div>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger className={classesTabTrigger} value="teams">
                Active
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="invites">
                Invites
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="network">
                Network
              </TabsTrigger>
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
              <TabsContent value="teams">
                <TeamsList className="grid w-full gap-y-5 " Render={TeamCard} />
              </TabsContent>
              <TabsContent value="invites">
                <div className="">
                  <h2 className="mb-4 text-lg font-semibold">
                    No invites yet.
                  </h2>
                </div>
              </TabsContent>
            </div>
          </IsSignedIn>
        </section>
      </Tabs>
    </>
  )
}
