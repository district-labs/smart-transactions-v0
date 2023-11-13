import * as React from "react"
import { env } from "@/env.mjs"
import { Button } from "@district-labs/ui-react"
import Confetti from 'react-confetti'
import { useMutation } from "wagmi"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

type TeamInviteAcceptButton = React.HTMLAttributes<HTMLElement> & {
  teamId: string
  label?: string
}

export const TeamInviteAcceptButton = ({
  className,
  teamId,
  label = "Accept Invite",
}: TeamInviteAcceptButton) => {
  const classes = cn(className)
  const router = useRouter()
  const [ labelState, setLabelState ] = React.useState<string>(label)
  const [isExploding, setIsExploding] = React.useState(false)
  const updateUserMutation = useMutation({
    mutationFn: (data: { teamId: string }) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}team/invite/${teamId}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          ...data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: () => {
      toast({
        description:
          "Invitation accepted! You'll be redirected shortly.",
      })
        setLabelState("Invitation Accepted")
      setIsExploding(true)
      setTimeout(() => {
        router.push(`/team/${teamId}`)
        }, 5000)
    },
  })

  const handleAcceptInvite = () => {
    updateUserMutation.mutate({
      teamId,
    })
  }

  return (
    <>
      {isExploding && <Confetti className="z-50 inset-full absolute" /> }
      <Button onClick={handleAcceptInvite} className={classes}>
        {labelState}
      </Button>
    </>
  )
}
