"use client"

import { useEffect } from "react"
import { env } from "@/env.mjs"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { type z } from "zod"

import { userSchema } from "@/lib/validations/user"
import { useUserProfileGet } from "@/hooks/profile/use-user-profile-get"

import { Icons } from "../icons"
import { toast } from "../ui/use-toast"

type UserInput = z.infer<typeof userSchema>

export function FormUserProfile() {
  const queryClient = useQueryClient()
  const { data: userProfile, isSuccess: userProfileIsSuccess } =
    useUserProfileGet()

  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    if (userProfile) {
      form.setValue("firstName", userProfile.firstName)
      form.setValue("lastName", userProfile.lastName)
      form.setValue("email", userProfile.email)
    }
  }, [userProfileIsSuccess, userProfile, form])

  const updateUserMutation = useMutation({
    mutationFn: (data: UserInput) => {
      return fetch(`${env.NEXT_PUBLIC_API_URL}user/profile`, {
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
        description: "Profile update successful.",
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
        className="w-full"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-2xl font-bold">Account</h3>
          </CardHeader>
          <CardContent>
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
            <FormItem className="mt-6">
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
          </CardContent>
          <CardFooter className="bg-card-footer py-4">
            <Button disabled={updateUserMutation.isLoading}>
              {updateUserMutation.isLoading && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Update
              <span className="sr-only">Confirm details</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
