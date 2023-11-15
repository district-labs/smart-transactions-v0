"use client"

import { putUserApi } from "@district-labs/intentify-api-actions"
import { toast } from "@district-labs/ui-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useAccount } from "wagmi"
import { type z } from "zod"

import { userSchema } from "@/lib/validations/user"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

type UserInput = z.infer<typeof userSchema>

export function UpdateUserForm() {
  const { address } = useAccount()

  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: UserInput) => {
      if (!address) throw new Error("User not found")
      return putUserApi({
        address,
        ...data,
      })
    },
    onSuccess: () => {
      toast({
        description: "User info updated successfully.",
      })
    },
  })

  function onSubmit({ firstName, lastName, email }: UserInput) {
    updateUserMutation.mutate({
      firstName,
      lastName,
      email,
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input
                aria-invalid={!!form.formState.errors.firstName}
                placeholder="John"
                {...form.register("firstName")}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.firstName?.message}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input
                aria-invalid={!!form.formState.errors.lastName}
                placeholder="Wick"
                {...form.register("lastName")}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.lastName?.message}
            />
          </FormItem>
        </div>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.email}
              type="email"
              inputMode="email"
              placeholder="john@wick.com"
              {...form.register("email")}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.email?.message}
          />
        </FormItem>
        <Button disabled={updateUserMutation.isLoading}>
          {updateUserMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Confirm
          <span className="sr-only">Confirm details</span>
        </Button>
      </form>
    </Form>
  )
}
