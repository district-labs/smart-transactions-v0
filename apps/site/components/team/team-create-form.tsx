"use client"

import { env } from "@/env.mjs"
import {
  Button,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  Input,
  Textarea,
  UncontrolledFormMessage,
} from "@district-labs/ui-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { teamSchema } from "@/lib/validations/team-schema"

import { Icons } from "../icons"
import { toast } from "../ui/use-toast"

type TeamInput = z.infer<typeof teamSchema>

type CreateTeamForm = React.HTMLAttributes<HTMLElement> & {
  onSuccess?: () => void
}

export function CreateTeamForm({ onSuccess }: CreateTeamForm) {
  const queryClient = useQueryClient()

  const form = useForm<TeamInput>({
    resolver: zodResolver(teamSchema),
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: TeamInput) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}team`, {
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
      onSuccess?.()
      queryClient.invalidateQueries(["teams"])
      toast({
        description: "New team created.",
      })
    },
  })

  function onSubmit({ name, description }: TeamInput) {
    updateUserMutation.mutate({
      name,
      description,
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-y-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.name}
              placeholder="Team name"
              {...form.register("name")}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.name?.message}
          />
        </FormItem>
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              aria-invalid={!!form.formState.errors.description}
              placeholder="A captivating description of your team"
              {...form.register("description")}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.description?.message}
          />
        </FormItem>
        <Button disabled={updateUserMutation.isLoading}>
          {updateUserMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Create Team
          <span className="sr-only">Confirm details</span>
        </Button>
      </form>
    </Form>
  )
}
