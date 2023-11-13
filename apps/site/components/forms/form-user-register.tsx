"use client"

import { env } from "@/env.mjs"
import {
  Button,
  Form,
  FormControl,
  FormItem,
  Input,
} from "@district-labs/ui-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { useUserProfileGet } from "@/hooks/profile/use-user-profile-get"

import { Icons } from "../icons"
import { toast } from "@district-labs/ui-react"

export function FormUserRegister({ currentColor }: { currentColor: string }) {
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useUserProfileGet()

  const form = useForm<any>()

  const updateUserMutation = useMutation({
    mutationFn: (data: { email: string }) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}user/register`, {
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
      queryClient.invalidateQueries(["user", "profile"])
      toast({
        description: "Success! We'll get in touch with you soon.",
      })
    },
  })

  function onSubmit({ email }: any) {
    updateUserMutation.mutate({
      email,
    })
  }

  if (isLoading) {
    return <Loader2 className="animate-spin text-white" />
  }

  if (user?.email) {
    return (
      <Button variant={"secondary"}>
        Success! You registered for the alpha launch.
      </Button>
    )
  }

  if (updateUserMutation.isSuccess) {
    return (
      <Button variant={"secondary"}>
        Success! You registered for the alpha launch.
      </Button>
    )
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-[420px] items-center gap-x-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem className="flex-1">
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.email}
              type="email"
              inputMode="email"
              placeholder="vitalik@ethereum.org"
              className="block w-full rounded-md border-gray-300 bg-white text-neutral-700 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              {...form.register("email")}
            />
          </FormControl>
        </FormItem>
        <Button
          disabled={updateUserMutation.isLoading}
          className={cn(
            "rounded-md px-6 py-3 text-sm font-semibold text-black transition-colors duration-200",
            {
              "bg-purple-300 hover:bg-purple-300/80": currentColor === "purple",
              "bg-sky-300 hover:bg-sky-300/80": currentColor === "sky",
              "bg-yellow-300 hover:bg-yellow-300/80": currentColor === "yellow",
              "bg-teal-300 hover:bg-teal-300/80": currentColor === "teal",
              "bg-blue-300 hover:bg-blue-300/80": currentColor === "blue",
              "hover:bg-greeen-300/80 bg-green-300": currentColor === "green",
              "bg-orange-400 hover:bg-orange-400/80": currentColor === "orange",
              "bg-red-300 hover:bg-red-300/80": currentColor === "red",
              "bg-neutral-300 hover:bg-neutral-300/80":
                currentColor === "neutral",
            }
          )}
        >
          {updateUserMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Register for Alpha
          <span className="sr-only">Confirm details</span>
        </Button>
      </form>
    </Form>
  )
}
