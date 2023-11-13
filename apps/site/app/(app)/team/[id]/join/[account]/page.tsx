"use client"

import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"
import { WalletConnectAndAuthenticatePrompt } from "@/components/blockchain/wallet-connect-and-authenticate-prompt"
import { useTeamInviteGet } from "@/components/team/hooks/use-team-invite-get"
import { TeamInviteAcceptButton } from "./team-invite-accept-button"

export default function TeamJoinPage({ params }: any) {
  const {
    data: teamInvite,
    isSuccess: teamInviteIsSuccess,
    isError: teamInviteIsError,
    isLoading,
  } = useTeamInviteGet({ teamId: params.id })

  console.log(teamInvite, "teamInvite")

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <WalletConnectAndAuthenticatePrompt />
      <IsSignedIn>
        <section className="flex h-full min-h-[540px] w-full flex-col items-center justify-center">
          {teamInviteIsError && (
            <div className="container grid max-w-screen-md gap-y-5 text-center">
              <span className="text-5xl font-light">🤨 </span>
              <h1 className="text-center text-7xl font-extrabold leading-none">
                No Invitation Found
              </h1>
              <p className="text-center text-lg">
                No invite found for this team. <span className='font-bold italic'>Sorry fren</span>.
              </p>
            </div>
          )}
          {teamInviteIsSuccess && (
            <div className="container grid max-w-screen-md gap-y-5 text-center">
              <span className="text-xl font-light">Team Invitation</span>
              <h1 className="text-7xl font-extrabold leading-none">
                Join {teamInvite.team.name}
              </h1>
              <p className="mx-auto max-w-[420px] text-sm">
                {teamInvite.team.description}
              </p>
              <TeamInviteAcceptButton className="max-w-[265px] mx-auto" teamId={params.id} />
            </div>
          )}
        </section>
      </IsSignedIn>
      <IsSignedOut></IsSignedOut>
    </>
  )
}
