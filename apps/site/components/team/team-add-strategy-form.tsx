"use client"

import { useEffect, useState } from "react"
import { env } from "@/env.mjs"
import { DbStrategy } from "@district-labs/intentify-database"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  UncontrolledFormMessage,
} from "@district-labs/ui-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Icons } from "../icons"
import { userStrategiesGet } from "../strategies/hooks/use-strategies-get"
import { toast } from "../ui/use-toast"

export const inviteSchema = z.object({
  strategyId: z.string().min(1, {
    message: "Must contain at least 22 character.",
  }),
})

type AddStrategyInput = z.infer<typeof inviteSchema>

type TeamCreateInviteForm = React.HTMLAttributes<HTMLElement> & {
  teamId: string
  onSuccess?: () => void
}

export function TeamAddStrategyForm({
  teamId,
  onSuccess,
}: TeamCreateInviteForm) {
  const { data: strategies, isSuccess } = userStrategiesGet()

  console.log(strategies, "strategies")

  const [strategyOptions, setFormOptions] = useState()
  useEffect(() => {
    if (strategies && isSuccess) {
      setFormOptions(
        strategies.map((strategy: DbStrategy) => {
          return {
            label: strategy.name,
            value: strategy.id,
          }
        })
      )
    }
  }, [strategies, isSuccess])

  if (!strategies || !isSuccess || !strategyOptions)
    return <span className="">Loading...</span>

  return (
    <TeamAddStrategyFormRender
      teamId={teamId}
      strategyOptions={strategyOptions}
      onSuccess={onSuccess}
    />
  )
}

type TeamAddStrategyFormRender = React.HTMLAttributes<HTMLElement> & {
  teamId: string
  strategyOptions: any
  onSuccess?: () => void
}

export function TeamAddStrategyFormRender({
  teamId,
  strategyOptions,
  onSuccess,
}: TeamAddStrategyFormRender) {
  const queryClient = useQueryClient()

  const form = useForm<AddStrategyInput>({
    resolver: zodResolver(inviteSchema),
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: { strategyId: string; teamId: string }) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}team/strategy`, {
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
      queryClient.invalidateQueries(["team", "get"])
      toast({
        description: `Strategy added to team.`,
      })
    },
  })

  function onSubmit({ strategyId }: AddStrategyInput) {
    updateUserMutation.mutate({
      strategyId: strategyId,
      teamId: teamId,
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-y-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="strategyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategy</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  aria-invalid={!!form.formState.errors.strategyId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategyOptions.map((strategy: any) => {
                      return (
                        <SelectItem key={strategy.value} value={strategy.value}>
                          {strategy.label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.strategyId?.message}
              />
            </FormItem>
          )}
        />
        <Button disabled={false}>
          {updateUserMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Add Strategy
          <span className="sr-only">Add Strategy to Team</span>
        </Button>
      </form>
    </Form>
  )
}
