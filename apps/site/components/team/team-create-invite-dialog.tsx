import * as React from "react"
import { env } from "@/env.mjs"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@district-labs/ui-react"
import { CopyToClipboard } from "react-copy-to-clipboard"

import { cn } from "@/lib/utils"

import { LinkComponent } from "../shared/link-component"
import { toast } from "../ui/use-toast"
import { TeamCreateInviteForm } from "./team-create-invite-form"

type TeamInviteDialog = React.HTMLAttributes<HTMLElement> & {
  label?: string
  teamId: string
}

export const TeamInviteDialog = ({
  className,
  label = "Create Invite",
  teamId,
}: TeamInviteDialog) => {
  const classes = cn("flex items-center gap-x-2", className)
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isSuccess, setIsSuccess] = React.useState<{
    status: boolean
    data: any
    link: string
  }>({
    status: false,
    data: null,
    link: "",
  })

  const handleSuccess = (data: { teamId: string; userId: string }) => {
    setIsSuccess({
      status: true,
      data: data,
      link: `${env.NEXT_PUBLIC_APP_URL}team/${data.teamId}/join/${data.userId}`,
    })
  }

  const reset = () => {
    setIsOpen(false)
    setIsSuccess({
      status: false,
      data: null,
      link: "",
    })
  }

  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={() => setIsOpen(true)}>
        <Button variant="outline" className={classes}>
          <span>{label}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={() => reset()}
        onInteractOutside={() => reset()}
        hideCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Create Team Invite</DialogTitle>
          <DialogDescription>
            Invite a new member to your team.
          </DialogDescription>
        </DialogHeader>
        {isSuccess.status && (
          <div className="grid gap-y-5">
            <div className="max-w-2/3 w-full overflow-x-auto border-2 border-dotted border-indigo-100 bg-neutral-100 p-2">
              <LinkComponent href={isSuccess.link} className="text-xs">
                <span className="">{isSuccess.link}</span>
              </LinkComponent>
            </div>
            <CopyToClipboard
              text={isSuccess.link}
              onCopy={() =>
                toast({
                  description: "Copied Invite link to clipboard.",
                })
              }
            >
              <span className="cursor-pointer text-xs">Copy Invite Link</span>
            </CopyToClipboard>
          </div>
        )}
        {!isSuccess.status && (
          <TeamCreateInviteForm
            teamId={teamId}
            onSuccess={(data) => handleSuccess(data)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
