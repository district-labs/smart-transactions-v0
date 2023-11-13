"use client"

import { env } from "@/env.mjs"
import {
  Button,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  Input,
  UncontrolledFormMessage,
} from "@district-labs/ui-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Icons } from "../icons"
import { toast } from "../ui/use-toast"

export const inviteSchema = z.object({
  userId: z.string().min(1, {
    message: "Must contain at least 22 character.",
  }),
})

type InviteInput = z.infer<typeof inviteSchema>

type TeamCreateInviteForm = React.HTMLAttributes<HTMLElement> & {
  teamId: string
  onSuccess?: (data: any) => void
}

export function TeamCreateInviteForm({
  teamId,
  onSuccess,
}: TeamCreateInviteForm) {
  const queryClient = useQueryClient()

  const form = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: { userId: string; teamId: string }) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}team/invite`, {
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
    onSuccess: (_data, { teamId, userId }) => {
      onSuccess?.({
        teamId,
        userId,
      })
      queryClient.invalidateQueries(["teams"])
      toast({
        description: "Invite created.",
      })
    },
  })

  function onSubmit({ userId }: InviteInput) {
    updateUserMutation.mutate({
      userId: userId,
      teamId: teamId,
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-y-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.userId}
              placeholder="Address"
              {...form.register("userId")}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.userId?.message}
          />
        </FormItem>
        <Button disabled={false}>
          {updateUserMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Create Invite
          <span className="sr-only">Create Invite to Team</span>
        </Button>
      </form>
    </Form>
  )
}
