import * as React from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@district-labs/ui-react"
import { PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { CreateTeamForm } from "./team-create-form"

type TeamCreateDialog = React.HTMLAttributes<HTMLElement> & {
  label?: string
}

export const TeamCreateDialog = ({
  className,
  label = "Create Team",
}: TeamCreateDialog) => {
  const classes = cn("flex items-center gap-x-2", className)
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={() => setIsOpen(true)}>
        <Button className={classes}>
          <span>{label}</span>
          <PlusCircle size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={() => setIsOpen(false)}
        onInteractOutside={() => setIsOpen(false)}
        hideCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Create District Team</DialogTitle>
          <DialogDescription>
            District Teams are a way to organize your strategies and share them
            with others. You can create a team and invite others to join.
          </DialogDescription>
        </DialogHeader>
        <CreateTeamForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
