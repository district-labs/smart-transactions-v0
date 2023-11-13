"use client"

import { useEffect, useState } from "react"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnectAndAuthenticatePrompt } from "@/components/blockchain/wallet-connect-and-authenticate-prompt"
import { useTeamGet } from "@/components/team/hooks/use-team-get"
import { TeamAddStrategyDialog } from "@/components/team/team-add-strategy-dialog"
import { TeamInviteDialog } from "@/components/team/team-create-invite-dialog"
import { TeamInviteCard } from "@/components/team/team-invite-card"
import { TeamMemberCard } from "@/components/team/team-member-card"
import { TeamStrategyCard } from "@/components/team/team-strategy-card"

export default function TeamPage({ params }: any) {
  const { data, isSuccess } = useTeamGet({ teamId: params.id })
  const classesTabTrigger =
    "border-neutral-700 data-[state=active]:border-b-2 rounded-none justify-start text-lg p-0 mr-8 pb-4"

  console.log(data, "data")

  const [membersActive, setMembersActive] = useState<any[]>([])
  const [membersInvited, setMembersInvited] = useState<any[]>([])
  const [activeStrategies, setActiveStrategies] = useState<any[]>([])
  useEffect(() => {
    if (isSuccess && data.members && data.members.length > 0) {
      const membersActive = data.members.filter(
        (member: any) => member.role != "invited"
      )
      const membersInvited = data.members.filter(
        (member: any) => member.role == "invited"
      )
      setMembersActive(membersActive)
      setMembersInvited(membersInvited)
    }
    if (isSuccess && data.strategies && data.strategies.length > 0) {
      setActiveStrategies(data.strategies)
    }
  }, [data, isSuccess])

  if (!isSuccess) {
    return <p>Loading...</p>
  }

  return (
    <>
      <WalletConnectAndAuthenticatePrompt />
      <Tabs className="w-full" defaultValue="strategies">
        <section className="section border-b-2">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-2">
              <div className="">
                <h4 className="text-normal">Team</h4>
                <h1 className="text-5xl font-bold">{data.name}</h1>
                <p className="mt-2 text-sm font-medium">{data.description}</p>
              </div>
              <div className="flex justify-end gap-x-2">
                <TeamInviteDialog teamId={params.id} />
                <TeamAddStrategyDialog teamId={params.id} />
              </div>
            </div>
            <TabsList className="mb-1 mt-10 bg-transparent p-0">
              <TabsTrigger className={classesTabTrigger} value="strategies">
                Strategies
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="members">
                Members
              </TabsTrigger>
              <TabsTrigger className={classesTabTrigger} value="invites">
                Invites
              </TabsTrigger>
            </TabsList>
          </div>
        </section>
        <section className="section py-10">
          <IsSignedOut>
            <div className="container max-w-6xl">
              <div className="grid grid-cols-6 gap-x-12">
                <div className="col-span-4">{/* <SkeletonCardForm /> */}</div>
                <div className="col-span-2">{/* <SkeletonCardBasic /> */}</div>
              </div>
            </div>
          </IsSignedOut>
          <IsSignedIn>
            <div className="container max-w-6xl">
              <TabsContent value="strategies" className="grid gap-y-10">
                {activeStrategies?.map((strategyRef: any) => (
                  <TeamStrategyCard
                    key={strategyRef.strategyId}
                    id={strategyRef.strategyId}
                    name={strategyRef.strategy.name}
                    description={strategyRef.strategy.description}
                    chainsSupported={[]}
                  />
                ))}
              </TabsContent>
              <TabsContent value="members">
                {membersActive?.map((member: any) => (
                  <TeamMemberCard
                    key={member.id}
                    role={member.role}
                    address={member.user.address}
                    firstName={member.user.firstName}
                    lastName={member.user.lastName}
                  />
                ))}
              </TabsContent>
              <TabsContent value="invites">
                {membersInvited?.map((member: any) => (
                  <TeamInviteCard
                    key={member.id}
                    role={member.role}
                    address={member.userId}
                  />
                ))}
              </TabsContent>
            </div>
          </IsSignedIn>
        </section>
      </Tabs>
    </>
  )
}
